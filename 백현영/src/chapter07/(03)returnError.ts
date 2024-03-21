// ---------------- return error ----------------
// 이전까지 error를 throw하는 방법과 null을 반환해 처리하는 방법을 배웠다.
// 다만 이 두가지 방법은 **게으른 개발자**를 만난다면 끔찍한 결과를 초래할 수 있다.
// try/catch를 사용하지 않고서는 에러를 잡을 수 없기 때문이다.
// 그렇다면 컴파일 타임에 성공과 실패를 모두 처리하도록 가이드하는 방법은 없을까?

import { isValid } from './(01)returnNull';

class InvalidDateFormatError extends RangeError {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

class DateIsInTheFutureError extends RangeError {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

// 성공 실패하는 경우를 모두 return 하도록 만들면 이를 사용하는 코드에서는 성공과 실패를 모두 처리해야한다.

/**
 * @throws {InvalidDateFormatError} 사용자가 생일 형식을 잘못 입력함
 * @throws {DateIsInTheFutureError} 사용자가 현재의 date보다 미래의 날짜를 입력함
 */
function parse(
  birthday: string
): Date | InvalidDateFormatError | DateIsInTheFutureError {
  // 에러가 또 늘어나면 T | Error1 | Error2 | Error3 ... 이런식으로 늘어나서 귀찮을 수 있다.
  // 다만 안전성은 올라가겠지
  let date = new Date(birthday);

  if (!isValid(date)) {
    return new InvalidDateFormatError('Enter a valid date');
  }

  if (date.getTime() > Date.now()) {
    return new DateIsInTheFutureError('Are you a timelord?');
  }

  return date;
}

function App() {
  const result = parse('2020-10-10');

  // ❌
  // 모든 에러를 처리해야한다.
  // if (result instanceof InvalidDateFormatError) {
  //   console.error(result.message);
  // } else {
  //   console.info('Date is', result.toISOString());
  // }

  // ✅
  if (result instanceof InvalidDateFormatError) {
    console.error(result.message);
  } else if (result instanceof DateIsInTheFutureError) {
    console.error(result.message);
  } else {
    console.info('Date is', result.toISOString());
  }
}

// if else로 퉁칠수도 있다
function SimpleCatchApp() {
  const result = parse('2020-10-10');

  if (result instanceof Error) {
    console.error(result.message);
  } else {
    console.info('Date is', result.toISOString());
  }
}

export {};
