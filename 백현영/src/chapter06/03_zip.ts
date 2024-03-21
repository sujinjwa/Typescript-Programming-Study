// --------------------- safe extention for prototype ---------------------
interface Array<T> {
  zip<U>(list: U[]): [T, U][];
}

// if) zip을 구현하는데 무언가를 import 해야해서 모듈 시스템을 따른다면 ?
// declare global {
//   interface Array<T> {
//     zip<U>(list: U[]): [T, U][];
//   }
// }

Array.prototype.zip = function <T, U>(this: T[], list: U[]): [T, U][] {
  return this.map((v, k) => tuple(v, list[k]));
};

function tuple<T extends unknown[]>(...list: T) {
  return list;
}

console.log([1, 2, 3].map((n) => n * 2).zip(['a', 'b', 'c']));

// 전역에 등록했기에 import 안해도 됨
// 근데 사용하는 코드의 Array.prototype에 먼저 등록하려면 ?
// ...tsconfig.json
// {
//   "exclude": ["./src/chapter06/03_zip.ts"]
// }
// 와 같이 설정하고 import 해서 사용하면 된다.
