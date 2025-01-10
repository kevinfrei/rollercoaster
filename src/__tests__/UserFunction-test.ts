import {
  MakePoint,
  MakeVector,
  MakeUserFunc,
  DemandUserFunc,
  CopyUserFunc,
  GetFunc,
  FuncListRange,
  FuncArrayString
} from '../UserFunction';

it ('makes stuff without failing', () => {
  const pt = MakePoint(1,1);
  const vec = MakeVector(pt, 0, 1, true);
  const df = DemandUserFunc('x*x', 1, 2);
  const uf = MakeUserFunc('x', 0, 1);
  const cf = CopyUserFunc(uf, 2, 3);
  const ua = [uf, df, cf];
  const gf = GetFunc(ua, .5);
  const flr = FuncListRange(ua);
  const fas = FuncArrayString(ua);
});
it ('seems consistent', () => {
  const df = DemandUserFunc('x*x', 1, 2);
  const uf = MakeUserFunc('x', 0, 1);
  const cf = CopyUserFunc(uf, 2, 3);
  const ua = [uf, df, cf];
  const gf = GetFunc(ua, .5);
  expect(GetFunc(ua, .5)).toEqual(uf);
  expect(FuncListRange(ua).low).toEqual('0');
  expect(FuncListRange(ua).high).toEqual('3');
});
