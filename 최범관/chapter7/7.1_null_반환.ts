import askAsync, { isValid } from './module';

// function parse(birthday: string): Date | null {
//   // 입력 값에 대한 검증을 해야함
//   return new Date(birthday);
// }

function parse(birthday: string): Date | null {
  let date = new Date(birthday);

  // 유효하지 않은 날짜라면 null을 반환한다.
  if (!isValid(date)) {
    return null;
  }

  return date;
}

function someWorkWithDate(date: Date) {
  console.log('Date is', date);
}

async function run() {
  const input = await askAsync('생일을 입력해주세요');
  const date = parse(input);
  // null을 통해 동작을 처리한다.
  if (date) {
    someWorkWithDate(date);
  } else {
    console.error('Error parsing date for some reason');
  }
}

// null을 통한 에러 핸들링은 자세한 에러 핸들링이 어렵다
// 또한 개발자는 에러를 통해서 자세한 정보를 알 수 없기 때문에 어떤 에러인지 확인하기 위해 직접 로그를 확인하며 디버깅 해야한다.
// 모든 연산에서 null을 확인해야 하므로 연산을 중첩하거나 연결할 때 코드가 지저분해진다.

run();
