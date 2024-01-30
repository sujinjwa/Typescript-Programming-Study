// 개발자에게 성공과 에러 상황을 모두 처리하도록 알려주려면? => 예외 반환

// 타입스크립트는 throws문을 지원하지 않는다.
// 하지만 유니온 타입을 이용해 비슷하게 흉내낼 수 있다.
function parseReturn(birthday: string): Date | InvalidDateFormatError | DateIsInTheFutureError {
  let date = new Date(birthday);
  if (!isValid(date)) {
    return new InvalidDateFormatError("Enter a date in the form YYYY/MM/DD");
  }
  if (date.getTime() > Date.now()) {
    return new DateIsInTheFutureError("Are you a timelord");
  }
  return date;
}

function myBirthday(date: Date) {
  console.log("My birthday is", date);
}

let resultReturn = parseReturn(ask()); // 날짜 또는 에러

// 세 가지 상황 모두 처리해야 하며 그렇지 않으면 컴파일 타임에 TypeError가 발생한다.
myBirthday(resultReturn);

if (resultReturn instanceof InvalidDateFormatError) {
  console.error(resultReturn.message);
} else if (resultReturn instanceof DateIsInTheFutureError) {
  console.error(resultReturn.message);
} else {
  console.info("Date is", resultReturn.toISOString());
  myBirthday(resultReturn);
}

// 타입스크립트의 타입 시스템을 활용하여
// parseReturn 시그니처에 발생할 수 있는 예외를 나열했다.
// 메서드 사용자에게 어떤 에러가 발생할 수 있는지를 전달했다.
// 메서드 사용자가 각각의 에러를 모두 처리하거나 다시 던지도록 강제했다.

// 예외 반환
// - API 사용자에게 실패 유형과 추가 정보를 얻을 수 있는 길을 알려주기에 충분하다.

// - 에러를 던지는 연산을 연쇄적으로 호출하거나 중첩하면 코드가 지저분해진다는 단점이 있다.

// T | Error1을 반환하는 함수를 이용하는 모든 호출자 함수는 두 가지 선택지 중 하나를 고를 수 있다.
// 1. 명시적으로 Error1을 처리한다.
// 2. T(성공 상황)을 처리하고 Error1은 호출자 함수의 사용자가 처리하도록 전달한다. 하지만 이 방법을 너무 자주 사용하면 최종 사용자가 처리해야 할 에러의 종류가 크게 늘어날 수 있다.
class Error1 extends Error {}
class Error2 extends Error {}
class Error3 extends Error {}

function returnTOrNull<T>(a?: T): T | null {
  if (a) {
    return a;
  }
  return null;
}

function x7<T>(): T | Error1 {
  let a = returnTOrNull<T>();
  // 성공 상황 처리
  if (a) {
    return a;
  }
  // 호출자 함수가 처리하도록 전달
  return new Error1();
}

function y7<U>(): U | Error1 | Error2 {
  let a = x7<U>();
  // 호출자 함수가 처리하도록 전달
  if (a instanceof Error) {
    return a;
  }
  // 성공 상황 처리
  return a;
}

// - 조금 복잡한 대신 안전성이 뛰어나다.
