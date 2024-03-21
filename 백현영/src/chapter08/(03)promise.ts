// ------------------- Promise -------------------
// 프로미스로 정상 회복하기 -> 미래의 동작을 설계할 수 있다. (then, try, catch, finally)
// 이전 fs.readFile같이 비동기작업을 할때 callback 패턴을 사용하지말고 promise를 사용해보자

import { appendFile, readFile } from 'fs';

// 원래라면 아래와 같이 구현해야했다.
// function appendAndRead(
//   path: string,
//   data: string,
//   cb: (error: Error | null, result: string | null) => void
// ) {
//   appendFile(path, data, (error) => {
//     if (error) {
//       return cb(error, null);
//     }

//     readFile(path, (error, result) => {
//       if (error) {
//         return cb(error, null);
//       }
//       if (typeof result === 'string') {
//         cb(null, result);
//       } else {
//         cb(new Error('error'), null);
//       }
//     });
//   });
// }

// callback 패턴이 사라졌다.
function appendAndReadPromise(
  path: string,
  data: string
): Promise<string, Error> {
  return appendPromise(path, data)
    .then(() => readPromise(path))
    .catch((err) => console.error(err));
}

// Promise를 구현해보자

type Excutor<T, E extends Error> = (
  resolve: (result: T) => void,
  reject: (error: E) => void
) => void;

class Promise<T, E extends Error> {
  constructor(fn: Excutor<T, E>) {}
  then<U, F extends Error>(g: (result: T) => Promise<U, F>): Promise<U, F> {
    return new Promise((resolve, reject) => {});
  }
  catch<U, F extends Error>(g: (error: E) => Promise<U, F>): Promise<U, F> {
    return new Promise((resolve, reject) => {});
  }
}

function readFilePromise(path: string) {
  return new Promise((resolve, reject) => {
    readFile(path, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

const a: () => Promise<string, TypeError> = () => {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      resolve('a');
    } else {
      reject(new TypeError('error'));
    }
  });
};
const b: (s: string) => Promise<number, never> = () => {
  return new Promise((resolve, reject) => {
    resolve(1);
  });
};
const c: (n: number) => Promise<boolean, RangeError> = () => {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      resolve(true);
    } else {
      reject(new RangeError('error'));
    }
  });
};

a()
  .then(b)
  .catch((e) => c())
  .then((result) => console.info('Done', result))
  .catch((e) => console.error(e));

export default null;
