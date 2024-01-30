// null 반환 - 타입 안전성을 유지하면서 에러를 처리하는 가장 간단한 방법

// null 반환 문제점
// - 개발자는 로그를 일일이 확인해가며 디버깅을 해야 한다.
// - 사용자는 자세한 오류 메시지 대신 모호한 에러 메시지를 보게 된다.
// - 조합이 어려워진다. 모든 연산에서 null을 확인해야 하므로 연산을 중첩하거나 연결할 때 코드가 지저분해진다.

function ask() {
  let birthday = prompt("When is your birthday?");
  return birthday ? birthday : "";
}

// 사용자가 유효한 내용을 입력하면 Date 반환, 그렇지 않으면 null 반환
// but 문제가 생긴 원인을 알 수가 없다.
function parseNull(birthday: string): Date | null {
  let date = new Date(birthday);
  if (!isValid(date)) {
    return null;
  }
  return date;
}

function isValid(date: Date) {
  return Object.prototype.toString.call(date) === "[object Date]" && !Number.isNaN(date.getTime());
}

let dateNull = parseNull(ask());
if (dateNull) {
  console.info("Date is", dateNull.toISOString());
} else {
  console.error("Error parsing date for some reason");
}
