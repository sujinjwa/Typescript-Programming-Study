// 예외 던지기
// 어떤 문제냐에 따라 대처가 가능할 수 있고, 디버깅에 도움되는 메타데이터도 얻을 수 있다.

// 커스텀 에러 타입
// 여러 형태의 RangeError를 던질 수 있게 하려면 에러를 서브클래싱하여 더 구체적으로 표현하면 된다.
class InvalidDateFormatError extends RangeError {}
class DateIsInTheFutureError extends RangeError {}

// 에러를 던질 때 커스텀 에러를 이용하면 어떤 문제가 생겼는지 알려줄 수 있을 뿐 아니라 문제가 생긴 이유도 설명할 수 있다.
// - 문제를 디버깅할 때 서버로그를 함께 확인하거나,
// - 사용자가 어떤 실수를 했으며 어떻게 문제를 해결할 수 있는지 알려주는 커스텀 에러 다이얼로그 등을 구현할 때 구체적인 에러가 도움이 된다.
// - 여러 동작을 하나의 try/catch 구문으로 감싸는 형태로 연쇄적이고 중첩된 동작을 효율적으로 만들 수 있다.

/**
 * @throws {InvalidDateFormatError} 사용자가 생일을 잘못 입력함
 * @throws {DateIsInTheFutureError} 사용자가 생일을 미래 날짜로 입력함
 */
function parseThrows(birthday: string): Date {
  let date = new Date(birthday);
  if (!isValid(date)) {
    throw new InvalidDateFormatError("Enter a date in the form YYYY/MM/DD");
  }
  if (date.getTime() > Date.now()) {
    throw new DateIsInTheFutureError("Are you a timelord");
  }
  return date;
}

// 전체 응용프로그램이 크래시되지 않도록 예외 잡기
try {
  let dateThrow = parseThrows(ask());
  console.info("Date is", dateThrow.toISOString());
} catch (e) {
  // 다른 에러가 발생했을 때 무시하지 않도록 처리하지 않은 에러는 다시 던지는 것이 좋다.
  if (e instanceof InvalidDateFormatError) {
    console.error(e.message);
  } else if (e instanceof DateIsInTheFutureError) {
    console.error(e.message);
  } else throw e;
}
