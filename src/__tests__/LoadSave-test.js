import {
  Obj2Map,
  Map2Obj,
  numFilter,
  stringFilter,
  objectFilter,
  arrayOfFilter
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
