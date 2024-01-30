import askAsync, { isValid } from './module';

function parse(birthday: string): Date {
  let date = new Date(birthday);

  // 문제가 발생하면 null 반환 대신 예외를 던지자
  if (!isValid(date)) {
    throw new RangeError('날짜를 YYYY/MM/DD 형식으로 작성해주세요.');
  }

  return date;
}

function someWorkWithDate(date: Date) {
  console.log(date);
}

async function run() {
  const input = await askAsync('생일을 입력해주세요');

  // 에러가 발생했을 때 어플리케이션이 크래쉬 되지 않도록 예외를 try-catch 블럭으로 잡는다.
  try {
    const date = parse(input);
    someWorkWithDate(date);
  } catch (e) {
    // 만일 예기치 못한 다른 에러가 발생했을 때 무시하지 않도록 예상 가능한 에러를 처리하고 예기치 못한 에러는 다시 던지는 것이 좋다
    if (e instanceof RangeError) {
      console.error(e.message);
    } else {
      throw e;
    }
  }
}

run();
