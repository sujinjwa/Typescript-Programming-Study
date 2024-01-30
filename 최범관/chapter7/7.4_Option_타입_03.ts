import askAsync, { isValid } from './module';

// 위와 같은 Option으로 처리하는 방식은 단순 배열 내부에 값이 존재할수도 존재하지 않을 수도 있는
// 방식으로 처리되므로 (무슨 일이 벌어지고 있는지?) 한눈에 파악하기 어렵다.

// 컨테이너라는 특수한 데이터 타입에 담아 개선해보자, 컨테이너를 다 구현하면 아래처럼 사용할 수 있게 된다
// function run {
//   const optionArray = await ask();

//   optionArray
//     .flatMap(parse)
//     .flatMap(date => new Some(date.toISOString()))
//     .flatMap(date => new Some('날짜는' + date + '입니다'))
//     .getOrElse('날짜를 파싱하는데 예기치 못한 에러가 발생했습니다.');
// }

// Option
// Option은 인터페이스로, Some과 None이 구현해야 하는 메서드를 정의한다.
// Some과 None의 클래스 메서드 관점에서는, Option 인터페이스를 따르는 새로운 인스턴스를 생성하는 기능을 가진다.

// 값이 존재하거나 존재하지 않음을 뜻하는 Option 타입. [T] | []
interface Option<T> {
  flatMap<U>(f: (value: T) => Option<U>): Option<U>; // 비어있을 수도 있는 Option에 연산을 연쇄적으로 수행하는 메서드
  getOrElse(value: T): T; // Option에서 값을 가져오는 메서드
}
interface Option<T> {
  flatMap<U>(f: (value: T) => None): None; // None 클래스가 flatMap을 호출했을 때의 반환값은 항상 None이므로 오버로드해 구체적인 타입 제공
}

// 연산 성공을 의미, 값이 만들어진 상황을 의미하는 클래스. [T]
class Some<T> implements Option<T> {
  constructor(private value: T) {}

  flatMap<U>(f: (value: T) => None): None;
  flatMap<U>(f: (value: T) => Some<U>): Some<U>;
  flatMap<U>(f: (value: T) => Option<U>): Option<U> {
    return f(this.value); // 콜백함수에 this.value를 전달해 새 Option 타입의 값을 반환
  }
  getOrElse(value: T): T {
    return this.value;
  }
}

// 연산 실패를 의미, 따라서 아무런 값이 담기지 않음. []
class None implements Option<never> {
  // 연산이 한번이라도 실패한 경우 항상 None을 반환
  flatMap(): None {
    return this;
  }
  getOrElse<U>(value: U): U {
    return value;
  }
}

// 이제 새 Option을 만드는 함수를 구현한다
function Option<T>(value: null | undefined): None;
function Option<T>(value: T): Some<T>;
function Option<T>(value: T): Option<T> {
  if (value == null) {
    return new None();
  }

  return new Some(value);
}

function run() {
  Option(6)
    .flatMap(n => Option(n * 3))
    .flatMap(n => new None())
    .getOrElse(7);
}

async function ask() {
  const answer = await askAsync('생일을 입력해주세요');

  return Option(answer);
}

function parse(birthday: string) {
  const date = new Date(birthday);

  if (!isValid(date)) {
    throw new Error('에러!');
  }

  return Option(new Date(date));
}

async function run2() {
  // const answer = await askAsync('생일을 입력해주세요');
  const answer = await ask();

  const result = answer // Option<string>
    .flatMap(parse) // Option<Date>
    .flatMap(date => new Some(date.toISOString())) // Option<string>
    .flatMap(date => new Some(`날짜는 ${date} 입니다.`)) // Option<string>
    .getOrElse('날짜를 가공하는데 예기치 못한 오류가 발생했습니다.'); // string

  console.log(result);

  // answer
  //   .flatMap(parse)
  //   .flatMap(date => new Some(date.toISOString()))
  //   .flatMap(date => new Some(`날짜는 ${date} 입니다.`))
  //   .getOrElse('날짜를 가공하는데 예기치 못한 오류가 발생했습니다.');
}

run2();
