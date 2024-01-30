import { DateIsFutureError, InvalidDateFormatError } from './7.2_커스텀_에러';
import askAsync, { isValid } from './module';

// 보통의 개발자는 게으르기 때문에 try/catch 구문으로 예외가 발생하는지 확인하지 않을것이다.
// 타입스크립트도 컴파일 타임에 특정 에러를 놓쳤으니 처리하라고 말하지 않는다.

// 그런 경우 예외를 반환할 수 있다.
// 이제 이 메서드를 사용하는 개발자는 모든 상황을 처리해야 하며 그렇지 않으면 컴파일 타임에 에러를 발생시킨다.
function parse(birthday: string) {
  const date = new Date(birthday);
  if (isValid(date)) {
    return new InvalidDateFormatError(
      '날짜를 YYYY/MM/DD 형식으로 입력해주세요'
    );
  }

  if (date.getTime() > Date.now()) {
    return new DateIsFutureError('시간여행자신가요?');
  }

  return date;
}

function someWorkWithDate(date: Date) {}

async function run() {
  const answer = await askAsync('생일을 입력해주세요.');
  const result = parse(answer);

  // someWorkWithDate(result);

  // 모든 상황에 대한 처리
  if (result instanceof InvalidDateFormatError) {
    console.error(result.message);
  } else if (result instanceof DateIsFutureError) {
    console.info(result.message);
  } else {
    someWorkWithDate(result);
  }
}

// 게으른 개발자는 에러를 개별적으로 처리하기 귀찮아할 수 있는데, 다음처럼 한번에 처리할 수 있다.

function run2() {
  const result = parse('2023/1/12');

  if (result instanceof Error) {
    console.error(result.message);
  } else {
    someWorkWithDate(result);
  }
}

// 복잡하지만 안정성이 뛰어난 에러처리
class Error1 extends Error {}
class Error2 extends Error {}
class Error3 extends Error {}

function someWorkThrow<T>(a?: T): T | Error {
  if (a) {
    return a;
  }

  return new Error();
}

// T(성공시 반환 타입)를 처리하고, Error1은 return 함으로써 함수를 호출하는 쪽에서 처리하도록 전달한다.
function x<T>(): T | Error1 {
  const a = someWorkThrow<T>();

  if (a) {
    return new Error1();
  }

  return a;
}

function y<U>(): U | Error1 | Error2 {
  const a = x<U>();

  if (a instanceof Error) {
    return a;
  }
  // a로 어떤 작업을 수행
  return a;
}

function z<V>(): V | Error1 | Error2 | Error3 {
  const a = y<V>();
  if (a instanceof Error) {
    return a;
  }

  // a로 어떤 작업을 수행
  const 어떤작업이이상해 = 'a' ? true : false;

  if (어떤작업이이상해) {
    return new Error3();
  }

  return a;
}
