import { Obj2Map, Map2Obj,
  numFilter, stringFilter, objectFilter, arrayOfFilter,
  LoadFuncSets, SaveFuncSets, FuncSetToArray, ArrayToFuncSet
} from '../LoadSave';

it('runs alright', () => {
  const objNum = {a:1, b:2, c:3};
  expect(Map2Obj(Obj2Map(objNum, numFilter))).toEqual(objNum);
  const objNums = {
    a:'nope',
    b:[4, 5, 6],
    c:[7, 8, 9],
    d:['a', '1', 2]
  };
  const expNums = {
    b:[4, 5, 6],
    c:[7, 8, 9],
    d:[2]
  };
  expect(Map2Obj(Obj2Map(objNums, arrayOfFilter(numFilter)))).toEqual(expNums);
  expect(objectFilter(objNum)).toEqual(objNum);
});

it('local storage testing', () => {
  const FlatFunc1 = {low:'1.2', high:'2.3', expr:'2^x'};
  const FlatFunc2 = {low:'2.3', high:'4.7', expr:'x+1'};
  const FlatFunc3 = {low:'4.7', high:'6.1', expr:'cos(pi x)'};
  const arr123 = [FlatFunc1, FlatFunc2, FlatFunc3];
  const arr132 = [FlatFunc1, FlatFunc3, FlatFunc2];
  const arr213 = [FlatFunc2, FlatFunc1, FlatFunc3];
  const arr231 = [FlatFunc2, FlatFunc3, FlatFunc1];
  const arr312 = [FlatFunc3, FlatFunc1, FlatFunc2];
  const arr321 = [FlatFunc3, FlatFunc2, FlatFunc1];
  const mp = new Map([
    ['arr123', arr123],
    ['arr132', arr132],
    ['arr213', arr213],
    ['arr231', arr231],
    ['arr312', arr312],
    ['arr321', arr321],
  ]);
  SaveFuncSets(mp);
  expect(LoadFuncSets()).toEqual(mp);
  expect(ArrayToFuncSet(FuncSetToArray(mp, 'arr123'))).toEqual(arr123);
});
