# Chapter3 - 타입의 모든 것

## 3-1. 타입을 이야기하다

```js
function squareOf(n) {
  return n * n;
}
```

위 함수는 n이라는 인수를 숫자로 받아 처리하는 것이 명확하며 숫자가 아닌 다른 타입을 전달하면 오류가 발생하는 함수입니다.

자바스크립트는 런타임에서 오류를 발생시키기 때문에, 타입스크립트의 타입 어노테이션을 통해 오류를 방지하며 프로그래머가 의도한대로 동작을 수행하도록 코드를 작성해 보겠습니다.

```ts
function sqaureOf(n: number) {
  return n * n;
}
```

이제 `sqareOf` 함수는 숫자 타입의 매개변수만 받아 처리할 수 있는 함수가 되었습니다.

## 3-2. 타입의 가나다

### any

any는 모든 타입을 허용할 수 있는 동적 타입입니다.

```ts
let foo: any = 'string';
foo = 1;
foo = true;
```

타입스크립트의 이점을 제대로 활용하고 싶다면 가급적 지양하고 최후의 수단으로 사용하는것이 좋습니다.

### unknown

unknown도 any와 비슷하게 모든 타입을 허용할 수 있는 동적 언어입니다.<br>
하지만 any는 모든 타입을 허용하고 사용해도 오류를 내지 않지만, unknown은 타입을 좁혀 정제하기 전까지 오류를 냅니다.

```ts
function plus(n: unknown) {
  // 매개변수 n을 number 타입으로 좁혀 정제
  if (typeof n === 'number') {
    return n + n;
  }
}
```

타입스크립트가 unknown으로 타입을 추론하는 경우는 없습니다.<br>
개발자가 명시적으로 지정해주는 경우에만 unknown 타입을 사용할 수 있습니다.

### boolean

논리 값(true, false)을 나타내는 타입입니다.

실무에서는 보통 명시적으로 타입을 지정해주기 보다 타입스크립트가 추론하게 두는 편입니다. 드물게 명시적으로 타입을 지정하는 경우도 있습니다.

```ts
let bool: boolean = true;
let bool = true;
```

### number

숫자 자료형을 나타내는 타입입니다.
boolean과 동일하게 대게 타입스크립트가 추론하게 두는 편입니다.

```ts
let num = 30;
```

### bigint

큰 정수를 처리할 수 있는 타입입니다.

number는 2의 52승까지의 정수만 처리할 수 있지만 bigint를 이용하면 이보다 큰 수도 표현할 수 있습니다. 가능하면 타입을 추론할 수 있도록 만드는 것이 좋습니다.

```ts
let a = 1234n;
```

### string

문자 자료형을 나타내는 타입입니다.
가능하다면 타입을 추론할 수 있도록 만드는 것이 좋습니다.

```ts
let str = 'str';
```

### symbol

ES2015에 새로 추가된 자료형으로 실무에서는 심벌을 자주 사용하지 않습니다.
객체와 Map 자료형에서 문자열 키를 대신하는 용도로 사용합니다.

unique symbol을 생성하는 방법 2가지

- Symbol을 상수에 할당해 타입스크립트가 unique symbol으로 추론하게 하는 것

  이 경우에는 타입스크립트가 typeof symbol으로 타입을 보여줍니다.

- unique symbol을 명시적으로 지정해주는 것

### 객체

객체의 타입을 나타내는 방법은 여러가지입니다.<br>
먼저 변수를 object로 선언하는 것입니다.

```ts
const obj: object = {
  foo: 'bar',
};

obj.foo; // 'object' 형식에 'foo' 속성이 없습니다.
```

하지만 object 타입으로 변수를 선언하게 된다면, 타입스크립트는 이 객체의 구체적인 형태를 알지 못하기 때문에 객체의 프로퍼티에 접근하려고 하면 에러를 발생시킵니다.

에러를 해결하기 위해서 객체 자료형을 객체 리터럴 형태로 타입을 선언해줄 수 있습니다.

```ts
let person: {
  name: string;
  age: number;
} = {
  name: 'choi',
  age: 24,
};
```

어떤 경우에는 객체의 프로퍼티가 없는 경우가 있을 수 있습니다.

> 예를 들어, API의 응답 값에 이 필드가 포함되거나 그렇지 않은 경우가 있을 수 있겠죠

또 어떤 프로퍼티의 값이 바뀌지 않았으면 좋겠다고 생각할 수도 있습니다.

타입스크립트는 타입을 객체 형태로 선언할 때 프로퍼티에 여러가지의 옵션을 지정할 수 있도록 합니다.

- **옵셔널 프로퍼티 (?)**

  ? 식별자를 통해서 프로퍼티를 가질수도, 가지지 않을수도 있음을 나타냅니다.

- **읽기전용 필드(readonly)**

  readonly 키워드를 통해 프로퍼티를 읽기 전용으로 만듭니다.<br> 해당 속성이 한번 할당되면 이후 수정할 수 없습니다.

- **인덱스 시그니처 (`[key: T]: U`)**

  `[key: T]: U` 형태의 문법을 통해 예정에 없던 프로퍼티가 추가될 수 있다고 알려줄 수도 있습니다. T 타입의 키는 U 타입의 값을 가진다고 해석합니다.

  T는 `number`나 `string`에 할당할 수 있는 타입이어야 합니다.

```ts
let person: {
  gender?: '남자' | '여자'; // 옵셔널한 프로퍼티
  readonly hobby: string; // 읽기전용 프로퍼티
  [grade: number]: number; // 인덱스 시그니처
} = {
  hobby: 'game',
  1: 100,
};

person.gender = '남자';
person.hobby = 'typing'; // 읽기 전용 속성이므로 'hobby'에 할당할 수 없습니다.
```

객체의 타입을 빈 객체 또는 `Object`로 설정하면 모든 프로퍼티를 수용할 수 있으나, 예기치 못한 동작을 초래할 수 있으므로 사용을 지양하는 것이 좋습니다.

```ts
const obj: {} = { a: 1 };
const obj2: Object = { a: 1 };
```

### 타입 별칭

변수를 값이 아닌 `const` `let` `var` 키워드로 선언해 변수명으로 지칭하듯, 타입도 `type` 키워드로 사용자 정의 타입을 만들어 이름을 지어줄 수 있습니다.

타입 별칭은 복잡한 타입을 DRY하지 않게 해주며 어떤 목적으로 이 변수가 사용되었는지 쉽게 이해할 수 있게 도와줍니다.

```ts
type Age = number;
type Name = string;
```

### 유니온 타입

유니온 타입은 여러 개의 타입 중 하나를 나타내기 위해 `|` 기호를 사용해 타입을 연결해 표현합니다.

```ts
type Age = number | string;
```

### 인터섹션 타입

인터섹션(교차) 타입은 두 개 이상의 타입을 `&` 기호를 통해 결합하여 새로운 타입을 생성하는 방법입니다.

```ts
type Animal = {
  name: string;
  age: number;
};

type Mammal = {
  canSwim: boolean;
};

type Dog = Animal & Mammal; // 교차 타입
```

### 배열

타입스크립트는 배열을 표현하기 위해 두 가지 배열 문법을 지원합니다.

**`T[]`**

```ts
const arr: number[] = [1, 2, 3];
```

**`Array<T>`**

```ts
const arr: Array<string> = ['a', 'b', 'c'];
```

대개 상황에서는 배열을 동형으로 만드는 것이 좋습니다.

#### 튜플

튜플(tuple)은 배열의 서브 타입입니다.
<br>튜플은 길이가 고정된 각 인덱스의 타입이 알려진 배열의 일종입니다.

튜플은 `?` 식별자를 통해 옵셔널한 값을 지정해줄 수 있습니다.

```ts
const arr: [string, number, boolean?] = ['str', 10];

// 같은 표현
const arr2: [string, number] | [string, number, boolean] = ['str', 10];
```

튜플이 최소 길이를 가지도록 지정할 때는 나머지 요소(...)를 사용할 수 있습니다.

```ts
const friend: [string, ...string[]] = ['choi', 'park', 'kim', 'yoon'];
```

튜플은 이형 배열을 안전하게 관리하고, 배열의 길이도 안전하게 조절할 수 있습니다.<br>
튜플의 기능들을 잘 활용하면 순수 배열에 비해 안전성을 높일 수 있으므로 튜플 사용을 권장합니다.

#### 배열(튜플)을 읽기 전용으로 선언하는 방법

읽기 전용 배열(튜플)을 만들기 위한 여러 선언 방식이 있다.

- `readonly T[]`
- `ReadonlyArray<T>`
- `Readonly<T[]>`

```ts
// 배열
type A = readonly string[];
type B = ReadonlyArray<string>;
type C = Readonly<string[]>;

// 튜플
type D = readonly [number, string];
type E = Readonly<[number, string]>;
```

사용자의 취향에 맞게 읽기 전용 배열을 생성하면 됩니다.

> 읽기 전용 배열은 요소를 변경할 수 없으므로 배열을 조금만 바꾸려고 해도 전체 배열을 얕은 복사를 통해 작업해야 하기 때문에 프로그램의 성능이 저하될 수 있습니다.

### null

값이 비었음을 나타냅니다.

### undefined

값이 정의되지 않았음을 나타냅니다.

### void

함수가 반환하는 값이 없음을 나타냅니다.

```ts
// void를 반환하는 함수
function hello() {
  console.log('hello');
}
```

### never

결코 발생하지 않는 값의 타입을 나타냅니다. 주로 예외를 던지거나 무한 루프에서 사용됩니다.

```ts
// never를 반환하는 함수
function errorFunc() {
  throw new TypeError();
}

// never를 반환하는 함수
function loop() {
  while (true) {
    // ...
  }
}
```

### 열거형

열거형(enum)은 특정 값들의 집합을 정의합니다.
<br>내부에 무슨 값들을 열거했냐에 따라 숫자(Numeric) 열거형, 문자(String) 열거형 그리고 숫자와 문자가 섞인 혼합 열거형으로 나뉩니다.

```ts
enum Weekdays {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}
```

보통 열거형은 위의 예시와 같이 사용하며 위 열거형은 숫자 열거형으로 부를 수 있습니다.

위 예시를 숫자 열거형이라고 부르는 이유는 특정한 값이 할당되지 않으면 자동으로 0부터 수가 할당되기 때문입니다.

> Monday = 1, TuesDay = 2..

열거형의 프로퍼티에는 키 또는 값으로 접근할 수 있습니다.<br>
자바스크립트의 객체와 동일하게 점 표기법 또는 괄호 표기법으로 접근할 수 있습니다.

```ts
// 값으로 접근
Weekdays[0]; // 'Sunday'

// 키로 접근
Weekdays.Monday; // 1
Weekdays['Tuesday']; // 2
```

하지만 열거형이 양방향(키 또는 값)으로 프로퍼티에 접근할 수 있게 하는 기능에는 단점이 있습니다.

첫째로 `Tree-shaking`이 되지 않습니다.<br>
타입스크립트가 자체적으로 구현했기 때문에 번들러는 '사용하지 않는 코드'라고 판단할 수 없어서 Tree-shaking을 실행하지 않습니다.

> **Tree-shaking<br>**
> 사용하지 않는 코드를 삭제하는 기능을 말합니다.<br>
> 나무를 흔들면 죽은 잎사귀들이 떨어지는 모습에 착안해 Tree-shaking이라고 부릅니다.

아래 코드를 살펴보면 enum Alp의 아무런 값도 참조되고 있지 않습니다.

```ts
enum Alp {
  a,
  b,
}
```

하지만 자바스크립트로 트랜스파일 된 코드를 보면, 아래와 같이 즉시실행 함수의 형태로 나타내고 있습니다.

이러한 즉시실행 함수의 자바스크립트 코드는 번들러가 '사용하지 않는 코드'라고 판단할 수 없기에 Tree-shaking이 발생되지 않습니다.

```js
var Alp;
(function (Alp) {
  Alp[(Alp['a'] = 0)] = 'a';
  Alp[(Alp['b'] = 1)] = 'b';
})(Alp || (Alp = {}));
```

둘째로 존재하지 않는 숫자키로 enum에 접근을 시도한다면 오류를 발생시키지 않습니다.

```ts
enum Alp {
  a,
  b,
}

Alp[300]; // undefined
```

이를 해결하기 위해서 더 안전한 열거형 타입인 `const enum`을 사용할 수 있습니다.

`const enum`은 자바스크립트의 객체와 같이 키 값으로만 접근할 수 있도록 합니다.

또, enum은 트랜스파일 될 때 인라인으로 확장됩니다.
그렇기 때문에 런타임에서 동적으로 접근할 수 없습니다.

위의 단점의 연장선으로 외부 모듈에서 import 할 수 없습니다. 트랜스파일 시점에 인라인으로 확장되기 때문에 에러가 발생합니다.

```ts
// TS
const enum NAME {
  USER_1 = 'USER1_NAME',
}

console.log(NAME.USER_1);

// JS로 컴파일 후
console.log('USER1_NAME' /* NAME.USER_1 */);
```

Babel과의 호환성 문제도 있습니다. (Babel은 const enum을 지원하지 않음)<br>
위와 같은 제한사항들이 있기 때문에 enum의 사용을 지양하는 것이 좋습니다.
