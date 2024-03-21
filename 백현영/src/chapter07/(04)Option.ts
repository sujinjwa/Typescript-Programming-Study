// --------------- Option --------------- (값과 에러를 유니온으로 반환하는(7-1~3) 외의 방법)
// : 에러가 발생할 수 있는 계산에 여러 연산을 연쇄적으로 수행할 때 사용한다
// 핵심 ! : **컨테이너**를 반환한다
// 어떤 컨테이너 ? -> **값(있을수도 없을수도 있는 값이 포함된)을 감싸는 컨테이너**
// Try, Either, Maybe, Option 이 있다

import { isValid } from './(01)returnNull';

// function ask() {
// *** 위와 같이 헸을경우 None과 Some을 반환하지만 flatmap의 Option을 만족하지 못하기에 컴파일타임에 이러가 발생했던것 ***
function ask(): Option<string> {
  // let answer = prompt('생일이 언제인가요 ?');
  const answer = '1994-12-10';
  // const answer = null;

  if (answer == null) {
    return new None();
  }

  return new Some(answer);
}

function parse(birthday: string): Option<Date> {
  const date = new Date(birthday);

  if (!isValid(date)) {
    return new None();
  }

  return new Some(date);
}

// 연산에 성공하여 값이 만들어짐 like [T]
class Some<T> implements Option<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  flatMap<U>(cb: (value: T) => None): None;
  flatMap<U>(cb: (value: T) => Some<U>): Some<U>;
  flatMap<U>(cb: (value: T) => Option<U>): Option<U> {
    return cb(this.value);
  }

  getOrElse(): T {
    return this.value;
  }
}

// 연산에 실패에 값이 없음 like []
class None implements Option<never> {
  flatMap(): None {
    return this;
  }

  getOrElse<U>(value: U): U {
    return value;
  }
}

// Option<T>는 Some<T>와 None으로 구성된다 [T] | []
// Some<T>와 None이 공유하는 인터페이스
interface Option<T> {
  flatMap<U>(callbackFn: (value: T) => Option<U>): Option<U>;
  getOrElse(value: T): T;
}

function Option<T>(value: null | undefined): None;
function Option<T>(value: T): Some<T>;
function Option<T>(value: T): Option<T> {
  if (value === null || value === undefined) {
    return new None();
  }

  return new Some(value);
}

const result = Option(6)
  .flatMap((n) => Option(n * 3))
  // .getOrElse('is Fail'); // 컴파일 타임에 에러가 발생한다 (Some 이 반환값이기에)
  // .getOrElse(); // 18
  .flatMap((n) => new None())
  .getOrElse('is Fail');

const result2 = ask()
  .flatMap(parse)
  .flatMap((date) => new Some(date.toUTCString()))
  // .flatMap((date) => {
  //   console.log('ask가 null 일때 전부 건너뜀 (주석처리된 flatmap console에 출력 X)');
  // })
  .flatMap((date) => new Some(`date is ${date}`))
  .getOrElse('만약 실패하면 여기 출력');

console.log(result2);

export default null;
