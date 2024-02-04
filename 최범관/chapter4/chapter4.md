# Chapter4 - 함수

## 4-1. 함수 선언과 호출

자바스크립트에서 함수는 일급(first-class) 객체입니다.

프로그래밍 언어에서 일급 객체로 취급되려면 객체가 아래와 같은 조건을 만족해야 합니다.

- 변수나 데이터에 담을 수 있어야 한다.
- 함수의 파라미터로 전달 할 수 있어야 한다.
- 함수의 리턴값으로 사용 할 수 있어야 한다.

### 함수에서의 추론

#### 매개변수

함수의 매개변수를 타입스크립트가 추론하지 않습니다.
보통 함수의 매개변수의 타입은 명시적으로 정의합니다.

#### 반환타입

반환타입은 타입스크립트가 추론하지만, 원한다면 명시할 수 있습니다.

자바스크립트는 여러 가지의 함수 선언 방식을 지원하는데, 그 중 함수 생성자는 위험하니 지양하는 것이 좋습니다.

```ts
const func = new Function('name', 'return 'hello' + name')
```

### 선택적 매개변수

함수도 객체나 튜플처럼 선택적으로 매개변수를 받아 처리할 수 있습니다.
선택적 매개변수는 맨 뒤에 위치해야 합니다.

```ts
function sayHello(firstName: string, lastName?: string) {
  console.log(`hi ${lastName || ''} ${firstName} `);
}

sayHello('choi');
sayHello('choi', 'beomkwan');
```

### 기본 매개변수

자바스크립트에서 했던것처럼 매개변수에 기본 값을 지정할수도 있습니다.

선택적 매개변수와 의미는 같습니다.
하지만 기본 값을 지정함으로써 선택적 매개변수임을 명시하지 않아도 선택적 매개변수로 취급되고, 타입스크립트가 타입을 추론해줍니다.

```ts
// userId는 선택적 매개변수, string type
function log(message: string, userId = 'Not signed in') {
  console.log(message, userId);
}
```

### 나머지 매개변수

함수로 전달되는 인수가 여러 개인 경우 배열 형태로 매개변수를 전달할 수 있습니다.

가변 길이를 가지는 인수를 받는 경우를 대비해 자바스크립트는 `arguments` 객체를 지원하는데, 이 문법을 사용하면 타입스크립트에서 오류가 발생합니다.

```ts
function sum() {
  return Array.from(arguments).reduce((total, c) => total + c, 0);
}

sum(1, 2, 3); // 0개의 인수가 필요한데 3개를 가져왔습니다.
```

이 문제를 해결하기 위해 나머지 매개변수(rest parameters)를 사용할 수 있습니다.

```ts
function sum(...numbers: number[]) {
  return numbers.reduce((total, c) => total + c, 0);
}
```

### this

자바스크립트 함수에서의 this는 함수를 호출한 방법에 의해 결정됩니다.

프로그래머가 의도한대로 this가 동작하도록 this 타입을 함수의 첫번째 매개변수에 선언할 수 있습니다.

```ts
function fancyDate(this: Date) {
  return ` ${this.getFullYear()} / ${this.getMonth()}`;
}
```

자바스크립트의 this는 예약어이기 때문에, 다른 매개변수와 완전히 다른 방식으로 처리됩니다.

### 호출 시그니처

아래와 같은 타입스크립트 문법을 호출 시그니처라고 부릅니다.

```ts
(a: number, b: number) => number;
```

호출 시그니처로 함수를 정의할 시에는 함수 표현식으로 함수를 정의해야 합니다.

#### 함수 시그니처의 오버로딩

> **오버로딩이란?**<br>
> 다른 매개 변수를 가진 같은 이름의 여러 함수를 만들 수 있는 기능

자바스크립트는 오버로딩을 지원하지 않습니다. 하지만 타입스크립트는 진정한 의미에서의 오버로딩은 아니지만, 오버로딩을 지원합니다.

```ts
type Reservation = void;

// 아래 두개의 타입은 동일한 타입입니다.
type Reserve = {
  (from: Date, to: Date, destination: string): Reservation;
  (from: Date, destination: string): Reservation;
};

type Reserve = ((from: Date, to: Date, destination: string) => string) & ((from: Date, destination: string) => string);

let reserve: Reserve = (from, to, destination) => {};
```

타입스크립트가 호출 시그니처 오버로딩을 처리하는 방식 때문에 발생하는 오류입니다.
함수에 여러 개의 오버로드 시그니처를 선언하면, 함수의 타입은 이들 시그니처의 인터섹션이 됩니다.

그렇기에 오버로드된 함수 시그니처를 구현하기 위해서는 모든 타입을 처리할 수 있게 타입을 작성하고, 모든 타입에 대응하도록 구현해야 합니다.

```ts
const reserve: Reserve = (from: Date, toOrDestination: Date | string, destination?: string) => {
  if (toOrDestination instanceof Date && destination !== undefined) {
    // 왕복 여행 예약
  } else if (typeof toOrDestination === 'string') {
    // 편도 여행 예약
  }
};
```

### 제네릭

제네릭이란 함수, 클래스, 인터페이스 등에서 사용되는 타입 매개변수입니다.
제네릭을 활용하면 타입을 선언 시점이 아닌 사용 시점에 타입을 지정하여 여러 종류의 타입을 지원하는 유연한 코드를 작성할 수 있습니다.

꺽쇠괄호(<>)로 제네릭 타입 매개변수임을 선언합니다.

```ts
function arrLengthCalc(arr: number[] | string[] | boolean[]): number {
  return arr.length;
}

arrLengthCalc([1, 2, 3]);
arrLengthCalc(['a', 'b', 'c']);
arrLengthCalc([true, false, true]);

// 제네릭을 사용한 경우F
function arrLengthCalc<T>(arr: T[]): number {
  return arr.length;
}

arrLengthCalc<number>([1, 2, 3]);
arrLengthCalc<string>(['a', 'b', 'c']);
arrLengthCalc<boolean>([true, false, true]);
```

제네릭에도 기본 타입을 설정할 수 있습니다.

```ts
function sayHello(firstName: string, lastName?: string) {
  console.log(`hi ${lastName || ''} ${firstName} `);
}

sayHello('choi'); // 'hi choi'
sayHello('choi', 'beomkwan'); // 'hi beomkwanchoi'
```
