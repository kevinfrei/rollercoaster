/*
//@flow
import {DemandUserFunc} from './UserFunction';

import type {FuncArray} from './UserFunction';

//type checker = (i:mixed) => boolean;
type filter<T> = (i:mixed) => ?T;
//type selector<T,K> = (t:T) => K;
type objmap<K,V> = {[key:K]: V};

// Some simple filters
export const numFilter:filter<number> = (i) =>
  (typeof i === 'number') ? i : undefined;

export const stringFilter:filter<string> = (i) =>
  (typeof i === 'string') ? i : undefined;

export const objectFilter:filter<Object> = (i) =>
  (i && typeof i === 'object') ? i : undefined;

// Filter producers
export function arrayOfFilter<T>(f:filter<T>):(i:mixed)=>?Array<T> {
  return (i:mixed):?Array<T> => {
    if (!i || !Array.isArray(i)) return;
    let res = [];
    for (let e of i) {
      const fl = f(e);
      if (fl) res.push(fl);
    }
    return res;
  }
};

// Helper function: objects as maps suck. Maps are faster & more efficient...
export function Obj2Map<V>(o:objmap<string, V>, f:filter<V>): Map<string, V> {
  let map:Map<string, V> = new Map();
  if (typeof o !== 'object') return map;
  for (let k in o) {
    if (o.hasOwnProperty(k)) {
      const val = f(o[k]);
      if (val)
        map.set(k, val);
    }
  }
  return map;
};

export function Map2Obj<K, V>(m:Map<K, V>):objmap<K,V> {
  let res:objmap<K,V> = {};
  for (let [k, v] of m) {
    res[k] = v;
  }
  return res;
};

export type FlatFunc = {
  low:string,
  high:string,
  expr:string
};

export type FuncSetsType = Map<string, Array<FlatFunc>>;

const flatFuncFilter:filter<FlatFunc> = (i:mixed): ?FlatFunc => {
  const o = objectFilter(i);
  if (!o) return;
  if (!o.hasOwnProperty('low') ||
      !o.hasOwnProperty('high') ||
      !o.hasOwnProperty('expr'))
    return;
  const low = parseFloat(o.low);
  const high = parseFloat(o.high);
  const expr = o.expr;
  if (isNaN(low) || isNaN(high)) return;
  return {low:low.toString(), high:high.toString(), expr};
};

export const LoadFuncSets = ():FuncSetsType => {
  const data = localStorage.getItem('funcLists');
  if (!data)
    return new Map();
  const obj = objectFilter(JSON.parse(data));
  return obj ? Obj2Map(obj, arrayOfFilter(flatFuncFilter)) : new Map();
};

export const SaveFuncSets = (funcSets:FuncSetsType) => {
  localStorage.setItem('funcLists', JSON.stringify(Map2Obj(funcSets)));
};

export const FuncSetToArray =
  (funcSet:FuncSetsType, which:string):FuncArray => {
  const funcStrings:?Array<FlatFunc> = funcSet.get(which);
  if (!funcStrings) {
    return [];
  }
  const res = funcStrings.map(fs => DemandUserFunc(fs.expr, fs.low, fs.high));
  return res;
};

export const ArrayToFuncSet = (fa:FuncArray): Array<FlatFunc> =>
  fa.map(f => ({low:f.range.low, high:f.range.high, expr:f.text}));
*/
export {};
