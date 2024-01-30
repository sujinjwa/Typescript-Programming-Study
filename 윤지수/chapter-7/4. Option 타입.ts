// Option 타입 - 특수 목적 데이터 타입을 사용해 예외를 표현하는 방법

// 이런 데이터 타입을 사용하지 않는 다른 코드와는 호환되지 않는다는 단점이 있지만
// 에러가 발생할 수 있는 계산에 여러 연산을 연쇄적으로 수행할 수 있다.

// 가장 많이 사용되는 타입 : Try, Option, Either 타입

// Option 타입
// 어떤 특정 값을 반환하는 대신 값을 포함하거나 포함하지 않을 수도 있는 컨테이너를 반환한다.
// 컨테이너는 자체적으로 몇 가지 메서드를 제공하며, 개발자는 이를 이용해 설혹 안에 값이 없을지라도 여러 가지 연산을 연쇄적으로 수행할 수 있다.
// 값을 포함할 수 있다면 어떤 자료구조로도 컨테이너를 구현할 수 있다.
// null 반환 방법처럼 Option도 에러가 발생한 이유를 사용자에게 알려주지 않는다. 단지 무엇인가가 잘못되었다는 사실만 알려준다.

function parseOption(birthday: string): Date[] {
  let date = new Date(birthday);
  if (!isValid(date)) {
    return [];
  }
  return [date];
}

let dateOption = parseOption(ask());
dateOption.map((_) => _.toISOString()).forEach((_) => console.log("Date is", _));

// 언제든 실패할 수 있는 여러 동작을 연쇄적으로 수행할 때 Option의 진가가 발휘된다.
function askOption() {
  let result = prompt("When is your birthday?");
  if (result === null) {
    return [];
  }
  return [result];
}

// 한눈에 파악하기 어려움
askOption()
  .map(parseOption)
  .flat()
  .map((date) => date.toISOString())
  .forEach((date) => console.log("Date is", date));

// 컨테이너라는 특수한 데이터 타입에 담아서 개선
// 컨테이너는 대상 값을 이용해 연산을 수행하는 방법과 그 결과를 얻어내는 방법을 드러내는 역할을 한다.

// Option 타입 정의
// - Container는 Some<T>와 None이 구현하게 될 인터페이스다.
// Some<T> : T라는 값을 포함하는 Option
// None : 값이 없는, 즉 실패한 상황의 Option

// - Container는 타입이기도 하고 함수이기도 하다.
// 타입 관점에서는 단순히 Some과 None의 슈퍼타입
// 함수 관점에서는 Option 타입의 새 값을 만드는 기능

// Option 타입 활용법
// - flatMap
// 비어있을 수도 있는 Option에 연산을 연쇄적으로 수행하는 수단
// Some<T>와 None에 .flatMap(f)를 호출한 결과
// None의 매핑 결과는 항상 None이며
// Some<T>의 매핑 결과는 f 호출 결과에 따라 Some<T>나 None이 된다.

// - getOrElse
// Container에서 값을 가져옴

interface Container<T> {
  flatMap<U>(f: (value: T) => None): None;
  flatMap<U>(f: (value: T) => Container<U>): Container<U>;
  getOrElse(value: T): T; // Container가 빈 None이면 기본값을 반환하고, Some<T>이면 Container 안의 값을 반환함
}
// 연산에 성공하여 값이 만들어진 상황
// 결과값을 포함한다.
class Some<T> implements Container<T> {
  constructor(private value: T) {}
  flatMap<U>(f: (value: T) => None): None;
  flatMap<U>(f: (value: T) => Some<U>): Some<U>;
  flatMap<U>(f: (value: T) => Container<U>): Container<U> {
    return f(this.value);
  }
  getOrElse(value: T): T {
    return this.value;
  }
}
// 연산이 실패한 상황
// 값을 담고 있지 않다.
class None implements Container<never> {
  flatMap(): None {
    return this;
  }
  getOrElse<U>(value: U): U {
    return value;
  }
}

function Container<T>(value: null | undefined): None;
function Container<T>(value: T): Some<T>;
function Container<T>(value: T): Container<T> {
  if (value == null) {
    return new None();
  }
  return new Some(value);
}

let resultContainer = Container(6)
  .flatMap((n) => Container(n * 3))
  .flatMap((n) => new None())
  .getOrElse(7);

function parseContainer(birthday: string) {
  let date = new Date(birthday);
  if (!isValid(date)) {
    return new None();
  }
  return new Some(date);
}

function askContainer() {
  let result = prompt("When is your birthday?");
  if (result === null) {
    return [];
  }
  return [result];
}

parseContainer(askContainer()[0])
  .flatMap((date) => new Some(date.toISOString()))
  .flatMap((date) => new Some("Date is" + date))
  .getOrElse("Error parsing date for some reason");

// Option 타입 장점
// - 성공하거나 실패할 수 있는 연산을 연달아 수행할 때 Option을 유용하게 사용할 수 있다.
// - Option을 사용하면 타입 안전성을 제공할 뿐 아니라
// 타입 시스템을 통해 연산이 실패할 수 있음을 사용자에게 알려준다.
// - 오버로드된 호출 시그니처를 활용하여(Option을 Some과 None으로만 제한하여) 코드를 훨씬 안전하게 만들 수 있다.

// Option 타입 단점
// - None으로 실패를 표현하기 때문에 무엇이 왜 실패했는지는 자세히 알려주지 못한다.
// - Option을 사용하지 않는 다른 코드와는 호환되지 않는다.(호환되지 않는 API는 Option을 반환하도록 직접 감싸야 한다.)
