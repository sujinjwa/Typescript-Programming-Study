import * as fs from 'fs';

// 콜백 지옥을 Promise를 통해 해결할 수 있다.
function appendPromise(path: string, data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.appendFile(path, data, error => {
      if (error) {
        reject(error);
      } else resolve();
    });
  });
}

function readPromise(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

function appendAndReadPromise(path: string, data: string): Promise<string> {
  return appendPromise(path, data).then(() => readPromise(path));
  // .catch(error => console.log(error));
}

appendAndReadPromise(
  '최범관/chapter8/exam.txt',
  '새로운 내용 추가를 시도합니다.'
);

// 직접 Promise를 구현해보자
type Executor<T> = (
  resolve: (result: T) => void,
  reject: (error: unknown) => void
) => void;

class CustomPromise<T> {
  constructor(f: Executor<T>) {}

  then<T1>(f: (result: T) => CustomPromise<T1>): CustomPromise<T1> {
    return new Promise((res, rej) => {}) as CustomPromise<T1>;
  }

  catch<T1>(f: (error: unknown) => CustomPromise<T1>): CustomPromise<T1> {
    return new Promise((res, rej) => {}) as CustomPromise<T1>;
  }
}
