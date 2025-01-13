//@flow
import {
  isNumber,
  isObjectNonNull,
  isString,
  hasStr,
} from '@freik/core-utils/lib/esm/types';
import { DemandUserFunc, FuncArray } from './UserFunction';

//type checker = (i:mixed) => boolean;
type filter<T> = (i: unknown) => T | undefined;

// Some simple filters
export const numFilter: filter<number> = (i) => (isNumber(i) ? i : undefined);

export const stringFilter: filter<string> = (i) =>
  isString(i) ? i : undefined;

export const objectFilter: filter<object> = (i) =>
  isObjectNonNull(i) ? i : undefined;

// Filter producers
export function arrayOfFilter<T>(f: filter<T>): filter<Array<T>> {
  return (i: unknown): Array<T> | undefined => {
    if (!i || !Array.isArray(i)) return;
    const res = [];
    for (const e of i) {
      const fl = f(e);
      if (fl) res.push(fl);
    }
    return res;
  };
}

// Helper function: objects as maps suck. Maps are faster & more efficient...
export function Obj2Map<V>(o: Record<string, V>, f: filter<V>): Map<string, V> {
  const map: Map<string, V> = new Map();
  if (!isObjectNonNull(o)) return map;
  for (const k in o) {
    if (hasStr(o, k)) {
      const val = f(o[k]);
      if (val) map.set(k, val);
    }
  }
  return map;
}

export function Map2Obj<K extends string, V>(m: Map<K, V>): Record<K, V> {
  const res: Partial<Record<K, V>> = {};
  for (const [k, v] of m) {
    res[k] = v;
  }
  return res as Record<K, V>;
}

export type FlatFunc = {
  low: string;
  high: string;
  expr: string;
};

export type FuncSetsType = Map<string, Array<FlatFunc>>;

const flatFuncFilter: filter<FlatFunc> = (i: unknown): FlatFunc | undefined => {
  const o = objectFilter(i);
  if (!o) return;
  if (!hasStr(o, 'low') || !hasStr(o, 'high') || !hasStr(o, 'expr')) return;
  const low = parseFloat(o.low);
  const high = parseFloat(o.high);
  const expr = o.expr;
  if (isNaN(low) || isNaN(high)) return;
  return { low: low.toString(), high: high.toString(), expr };
};

export function LoadFuncSets(): FuncSetsType {
  const data = localStorage.getItem('funcLists');
  if (!data) return new Map();
  const obj = objectFilter(JSON.parse(data));
  return obj ? Obj2Map(obj, arrayOfFilter(flatFuncFilter)) : new Map();
}

export function SaveFuncSets(funcSets: FuncSetsType) {
  localStorage.setItem('funcLists', JSON.stringify(Map2Obj(funcSets)));
}

export function FuncSetToArray(
  funcSet: FuncSetsType,
  which: string,
): FuncArray {
  const funcStrings: Array<FlatFunc> | undefined = funcSet.get(which);
  if (!funcStrings) {
    return [];
  }
  const res = funcStrings.map((fs) => DemandUserFunc(fs.expr, fs.low, fs.high));
  return res;
}

export function ArrayToFuncSet(fa: FuncArray): Array<FlatFunc> {
  return fa.map((f) => ({
    low: f.range.low,
    high: f.range.high,
    expr: f.text,
  }));
}
