//@flow

import type {FuncArray} from './UserFunction';

type FuncListElem = {
  low: number,
  high: number,
  expr: string
};

type FLArrayElem = {
  name: string,
  funcs: Array<FuncListElem>
};

type ObjMapToFLElem = {
  [key:string]: Array<FuncListElem>
};

type LoadState = {
  selected: number,
  funcLists: Map<string, Array<FuncListElem>>
};

type checker = (i:mixed) => boolean;
type filter<T> = (i:mixed) => ?T;
type selector<T,K> = (t:T) => K;
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

/*
const ValidateFuncListElem = (o:mixed): ?FuncListElem => {
  if (!o || typeof o !== 'object') return;
  if (o.low || typeof o.low !== 'string') return;
  const low = parseFloat(o.low);
  if (o.high || typeof o.high !== 'string') return;
  const high = parseFloat(o.high);
  if (o.expr || typeof o.expr !== 'string') return;
  const expr = o.expr;
  if (Number.isNaN(low) || Number.isNaN(high)) {
    return;
  }
  return {low, high, expr};
};

const ValidateFuncList = (o:mixed): ?Array<FuncListElem> => {
  return MapValid(o, ValidateFuncListElem);
};

const mapFromArrays = (
  a:Array<Array<OutputElem>>):Map<string, Array<FuncListElem>> => {
  const res:Map<string, Array<FuncListElem>> = new Map();
  a.forEach(i => {
    res.set()
  })
};

const loadStateArray = ():Array<Array<FuncListElem>> => {
  data = localStorage.getItem('funcLists');
  if (!data) return [];
  const obj = JSON.parse(data);
  return MapValid(obj, ValidateFuncList);
};
*/
