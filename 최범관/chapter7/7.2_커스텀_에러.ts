import askAsync, { isValid } from './module';

// 커스텀 에러 타입
// 내가 만든 에러와 다른 개발자가 추가한 에러를 구분할 수 있다.
// 커스텀 에러를 통해 어떠한 문제가 생겼는지, 문제가 생긴 이유도 설명할 수 있다
export class InvalidDateFormatError extends RangeError {}
export class DateIsFutureError extends RangeError {}

// 이 함수가 어떤 에러를 던지는지 확인할 수 있게 함수의 이름에 명시하거나(parseThrows) 문서화 주석(docblock)에 정보를 추가할 수 있다.
/**
 * @throws {InvalidDateFormatError} 사용자가 잘못된 날짜 형식을 입력함
 * @throws {DateIsFutureError} 사용자가 날짜를 미래로 설정함
 */
function parse(birthday: string): Date {
  const date = new Date(birthday);

  if (!isValid(date)) {
    throw new InvalidDateFormatError(
      '날짜를 YYYY/MM/DD 형식으로 입력해주세요.'
    );
  }
  if (date.getTime() > Date.now()) {
    throw new DateIsFutureError('시간여행자신가요?');
  }

  return date;
}

function nameParse(name: string) {
  if (typeof name !== 'string') {
    throw new Error('이름 똑바로 써라');
  }
}

// 유저 개인정보를 받는 일련의 작업.
async function run() {
  const birthday = await askAsync('생일을 입력해주세요.');

  try {
    const date = parse(birthday);
    console.info(date);
  } catch (e) {
    if (e instanceof InvalidDateFormatError) {
      console.error(e.message);
    } else if (e instanceof DateIsFutureError) {
      console.info(e.message);
    } else {
      throw e;
    }
  }
}

run();
