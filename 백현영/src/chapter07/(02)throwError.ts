import { isValid, ask } from './(01)returnNull';
// --------------- throw error ---------------
// null 반환 대신 throw 하자'

function parse(birthday: string): Date {
  let date = new Date(birthday);

  if (!isValid(date)) {
    throw new RangeError('Enter a valid date');
  }

  return date;
}

function App() {
  try {
    const date = parse(ask('생일이 언제인가요 ?'));
    console.info('Date is', date.toISOString());
  } catch (e) {
    if (e instanceof RangeError) {
      console.error(e.message);
    } else {
      // RangeError가 아닌 다른 에러가 발생할 경우 처리해주자
      throw e;
    }
  }
}

// parser나 ask에서 다른 형태의 Error를 throw할 경우
// 서브클래스를 만들어서 throw하자

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

// 왜 주석으로써 제공해야하는가 ?
// TS는 Error를 throw하는 경우를 함수의 시그니처에 포함시키지 않기때문에 import해와서 쓰는경우 모를 수 있다
// 다음장의 return Error를 사용해보자.
/**
 * @throws {InvalidDateFormatError} 사용자가 생일 형식을 잘못 입력함
 * @throws {DateIsInTheFutureError} 사용자가 현재의 date보다 미래의 날짜를 입력함
 */
function parse2(birthday: string): Date {
  let date = new Date(birthday);

  if (!isValid(date)) {
    throw new InvalidDateFormatError('Enter a valid date');
  } else if (date.getTime() > Date.now()) {
    throw new DateIsInTheFutureError('Are you a timelord?');
  }

  return date;
}

function App2() {
  try {
    const date = parse2(ask('생일이 언제인가요 ?'));
    console.info('Date is', date.toISOString());
  } catch (e) {
    if (e instanceof InvalidDateFormatError) {
      console.error(e.message);
    } else if (e instanceof DateIsInTheFutureError) {
      console.info(e.message);
    } else {
      throw e;
    }
  }
}

function AppRefactor() {
  try {
    // const invalidDate = 'sadasd';
    const invalidDate = new Date(
      Date.now() + 1000 * 60 * 60 * 24
    ).toLocaleDateString();
    const validDate = ask('생일이 언제인가요 ?');
    const date = parse2(invalidDate);
    console.info('Date is', date.toISOString());
  } catch (e) {
    if (e instanceof RangeError) {
      switch (e.name) {
        case InvalidDateFormatError.name:
          console.error(e.message);
          break;
        case DateIsInTheFutureError.name:
          console.info(e.message);
          break;
        default:
          throw e;
      }
    } else {
      throw e;
    }
  }
}

AppRefactor();

// summary
// 커스텀 에러를 만들어서 어떤 문제인지, 어째서 생긴 문제인지 알려주자
// JSdoc을 사용하면 더 좋다. -> 특히 import해서 사용하는 함수에 대해서

export {};
