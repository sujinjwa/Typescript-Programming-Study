# Chapter6 - 고급 타입

## 타입 간의 관계

### 서브타입과 슈퍼타입

> 서브타입<br>
> 두 개의 타입 A와 B가 있고 B가 A의 서브타입이면 A가 필요한 곳에는 어디든 B를 안전하게 사용할 수 있다.

```ts
// B는 A의 서브타입
type A = string | number;
type B = string;

function foo(a: A) {}

const b: B = 'blah';
foo(b);
```

> 슈퍼타입
> 두 개의 타입 A와 B가 있고 B가 A의 슈퍼타입이면 B가 필요한 곳에는 어디든 A를 안전하게 사용할 수 있다.

```ts
// B는 A의 슈퍼타입
type A = [string, number];
type B = (string | number)[];

const arr: A = ['hello', 10];

function foo(arr: B) {}

foo(arr);
```

### 가변성

가변성의 네 종류는 다음과 같습니다.

- 불변(invariance)
  정확히 T를 원함
- 공변(convariance)
  <:T를 원함 (서브타입)
- 반공변(contravariance)
  :T를 원함 (슈퍼타입)
- 양변(bicariance)
  <:T 또는 >:T를 원함 (서브타입 또는 슈퍼타입)

#### 형태와 배열 가변성

타입스크립트에서 모든 복합 타입의 멤버는 공변이며 함수 매개변수 타입만 예외적으로 반공변입니다.

보통 A라는 타입이 B라는 타입의 서브타입인지 아닌지 쉽게 판단할 수 있습니다. 매개변수화 된 타입(제네릭) 등 복합 타입에서는 이 문제가 더 복잡해집니다.

복합 타입의 서브타입 규칙은 프로그래밍 언어마다 다르며 같은 규칙을 가진 언어가 없을 정도입니다.

타입스크립트는 슈퍼 타입의 서브 타입을 기대하는 곳에 사용할 수 있도록 허용하는데, 이는 타입스크립트가 완벽한 안정성보다 실제 실수를 방지하는 것과 쉬운 사용 두 가지 목표를 균형있게 달성할 수 있도록 타입 시스템을 설계했기 때문입니다.

```ts
function deleteUser(user: { id?: number; name: string }) {
  delete user.id;
}

const existingUser = {
  id: 12345,
  name: 'im user',
};

deleteUser(existingUser);

existingUser; // 타입스크립트는 타입을 여전히 아래와 같이 추론함
// {
//   id: number;
//   name: string;
// }
```

위 코드를 통해 타입스크립트의 안정성에 문제가 있다는 사실을 알 수 있습니다.<br> 파괴적 갱신을 통해 `existingUser`의 id 프로퍼티를 삭제했지만, 타입스크립트는 삭제된 사실을 모르고 여전히 기존 형태의 객체로 타입을 추론합니다.

#### 함수 가변성

함수 A가 함수 B와 같거나 적은 수의 매개변수를 가지며 다음을 만족하면, A는 B의 서브타입입니다.

1. A의 this 타입을 지정하지 않으면 'A의 this 타입 >: B의 this 타입'이다.
2. A의 각 매개변수 >: B의 대응 매개변수이다.
3. A의 반환 타입 <: B의 반환 타입이다.

함수에서는 왜 매개변수의 타입이 반공변일까요? 함수의 매개변수가 반공변임을 증명하는 예시입니다.

```ts
class Animal {}
class Bird extends Animal {
  chirp() {}
}

// Bird <: Animal
let animal: Animal = new Animal();
animal = new Bird(); // Animal의 서브타입인 Bird를 할당할 수 있음

// IsSubtypeOf 조건부 타입을 통해 확인하겠습니다.
type IsSubtypeOf<T1, T2> = T1 extends T2 ? true : false;

// Bird는 Animal의 서브타입인가?
type T1 = IsSubtypeOf<Bird, Animal>; // true

// Func<TParam>은 타입이 TParam인 하나의 파라미터를 가지는 함수 타입을 만듭니다.
type Func<TParam> = (p: TParam) => void;

// 'Bird <: Animal'을 만족한다면 'Func<Bird> <: Func<Animal>'를 만족하는가?
type T2 = IsSubtypeOf<Func<Bird>, Func<Animal>>; // false
```

```ts
class Animal {}
class Bird extends Animal {
  chirp() {}
}
class Crow extends Bird {
  caw() {}
}
// Crow <: Bird <: Animal

// Bird를 받아 Bird를 반환하는 함수를 매개변수로 받음
function birdFunc(f: (b: Bird) => void) {}

// 매개변수에 Bird의 서브타입인 Crow를 전달
birdFunc((c: Crow) => {}); // error

// Bird의 슈퍼타입인 Animal을 전달
birdFunc((a: Animal) => {});
```

위 두 가지의 예시를 통해 함수의 매개변수는 반공변임을 증명할 수 있습니다.

### 할당성

할당성이란 A라는 타입을 B라는 타입이 필요한 곳에 사용할 수 있는지 결정하는 타입스크립트의 규칙을 의미합니다.

'A라는 타입을 B에 할당할 수 있는가?'라는 질문이 발생하면 타입스크립트는 열거형이 아닌 경우에는 다음과 같이 처리합니다.

1. A <: B (A가 B의 서브타입인지)
2. A가 any인지

enum과 const enum으로 만드는 열거형 타입에서는 다음과 조건 중 하나를 만족해야 A타입을 열거형 B에 할당할 수 있습니다.

1. A는 열거형 B의 멤버인지
2. 열거형 B는 number 타입의 멤버를 최소 한 개 이상 가지고 있으며(숫자 열거형, 혼합 열거형) A는 number인지

열거형의 할당성 규칙 2로 인해서 타입스크립트의 안정성이 많이 떨어지기 때문에 과감히 열거형을 코드에서 제거할 것을 권장합니다.

### 타입 넓히기

타입 추론이 어떻게 동작하는지 이해하는데 중요한 이론입니다. 타입스크립트는 타입을 정밀하게 추론하기보다 일반적으로 추론합니다.
타입스크립트는 변수인지 상수인지 판단해 타입을 넓히거나 좁혀 추론합니다.

만일 `let` 또는 `var` 키워드로 선언된 변수의 타입을 넓히지 않기를 원한다면 타입 어노테이션을 명시적으로 지정해줄 수 있습니다.

#### const 타입

타입스크립트는 타입을 넓혀지지 않도록 해주는 const라는 특별한 타입을 제공합니다. const를 타입 어설션으로 활용할 수 있습니다. 중첩된 자료구조에도 재귀적으로 적용됩니다.

```ts
let a = { x: 3 } as const; // { readonly x: 3 }
```

타입스크립트가 변수를 가능한 좁은 타입으로 추론하기 원한다면 타입 어설션을 활용할 수 있습니다.

#### 초과 프로퍼티 확인

객체 타입은 그 멤버와 공변입니다. 그렇기 때문에 기대하는 타입의 서브타입을 전달하면 오류가 발생하지 않습니다.

```ts
function greeting(human: { name: string }) {
  console.log(`hello, ${human.name}`);
}

const human = { name: 'choi', age: 20 };
greeting(human);
```

타입스크립트는 신선한 객체(객체 리터럴로부터 추론한 타입)에서 기대하는 타입에 존재하지 않는 프로퍼티를 가지고 있다면, 타입스크립트가 초과 프로퍼티를 확인하고 타입스크립트는 이를 에러로 처리합니다.

```ts
function greeting(human: { name: string }) {
  console.log(`hello, ${human.name}`);
}

// 개체 리터럴은 알려진 속성만 지정할 수 있으며 '{ name: string; }' 형식에 'age'이(가) 없습니다.
greeting({ name: 'choi', age: 20 });
```

하지만 신선한 객체가 아닌 경우에는 타입스크립트는 에러를 검출할 수 없습니다.

신선한 객체가 아닌 경우는 다음과 같습니다.

1. 타입 어설션을 통해 단언한 경우

```ts
function greeting(human: { name: string }) {
  console.log(`hello, ${human.name}`);
}

const human = { name: 'choi', age: 20 };
greeting(human);
```

2. 객체 리터럴을 변수에 할당하여 사용한 경우

```ts
type Human = { name: string };

function greeting(human: Human) {
  console.log(`hello, ${human.name}`);
}

const human = { name: 'choi', age: 20 };
greeting(human);
```

변수에 객체 리터럴을 할당해 사용하면서 초과 프로퍼티 확인을 항상 수행하고 싶다면 기대하는 타입을 어노테이션으로 명시할 수 있습니다.

```ts
type Human = { name: string };

function greeting(human: Human) {
  console.log(`hello, ${human.name}`);
}

// 개체 리터럴은 알려진 속성만 지정할 수 있으며 'Human' 형식에 'age'이(가) 없습니다.
const human: Human = { name: 'choi', age: 20 };
greeting(human);
```

### 정제

타입스크립트는 흐름 기반 타입 추론을 수행합니다. 마치 프로그래머가 코드를 읽듯 `if` `?` `||` `switch` 같은 제어 흐름 문장까지 고려해 타입을 정제합니다.

하지만 이런 타입스크립트가 타입을 정제하지 못하는 상황이 존재합니다.

```ts
type UserTextEvent = {
  value: string;
  target: HTMLInputElement;
};

type UserMouseEvent = {
  value: [number, number];
  target: HTMLElement;
};

type UserEvent = UserTextEvent | UserMouseEvent;

function handle(event: UserEvent) {
  if (typeof event.value === 'string') {
    event.value; // string
    event.target; // HTMLInputElement | HTMLElement
  }

  event.value; // [number, number]
  event.target; // HTMLInputElement | HTMLElement
}
```

if문에서 `event.value`의 타입의 조건을 검사하고 타입을 좁히기를 기대했지만, 타입스크립트는 타입을 좁히지 못했습니다.

이런 경우 태그드 유니온 패턴을 통해 타입스크립트가 타입을 좁힐 수 있게 코드를 작성할 수 있습니다.<br>
태그드 유니온 패턴이란 타입에 태그를 추가하여 효율적으로 타입을 설계할 수 있는 방식입니다.

다음은 좋은 태그의 조건입니다.<br>

1. 객체 타입에서는 같은 위치에 있고, 튜플 타입의 경우에는 같은 인덱스의 위치에 존재해야 합니다.

2. 리터럴 타입입니다. 다양한 리터럴 타입을 혼합하고 매치할 수 있지만 한 가지 타입만 사용하는 것이 바람직합니다. 보통은 문자열 리터럴 타입을 사용합니다.

3. 제네릭 타입의 인수를 받지 않아야 합니다.

4. 고유한 값을 가져야 합니다.

태그드 유니언 패턴을 통해 타입을 좁게 추론하도록 할 수 있습니다.

```ts
type UserTextEvent = {
  type: 'TextEvent';
  value: string;
  target: HTMLInputElement;
};

type UserMouseEvent = {
  type: 'MouseEvent';
  value: [number, number];
  target: HTMLElement;
};

type UserEvent = UserTextEvent | UserMouseEvent;

function handle(event: UserEvent) {
  if (event.type === 'TextEvent') {
    event.value; // string
    event.target; // HTMLInputElement
    return;
  }

  event.value; // [number, number]
  event.target; // HTMLElement
}
```

## 종합성

타입스크립트는 프로그래머가 모든 상황을 적절하게 처리했는지 검사하고 대응하지 못한 상황이 있다면 컴파일 타임에 에러를 발생시킵니다.

```ts
type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
type Day = Weekday | 'Sat' | 'Sun';

function getNextDay(w: Weekday): Day {
  switch (w) {
    case 'Mon':
      return 'Tue';
  }
} // 함수에 끝 return 문이 없으며 반환 형식에 'undefined'가 포함되지 않습니다.
```

## 고급 객체 타입

객체는 자바스크립트의 핵심이며 타입스크립트는 이 객체를 안전하게 표현하고 조작할 수 있는 다양한 수단을 제공합니다.

### 객체 타입의 타입 연산자

#### keyin 연산자

자바스크립트 객체의 필드를 찾는 문법과 비슷한 형태로 타입에서 키를 통해 탐색할 수 있다.

```ts
type APIResponse = {
  user: {
    id: string;
    friendList: {
      count: number;
      friends: {
        firstName: string;
        lastName: string;
      }[];
    };
  };
};

type FriendList = APIResponse['user']['friendList'];

function renderFriendList(friendList: FriendList) {
  // ...
}
```

#### keyof 연산자

객체의 모든 키를 문자열 리터럴 유니온 타입으로 가져올 수 있습니다.

```ts
type APIResponse = {
  user: {
    id: string;
    friendList: {
      count: number;
      friends: {
        firstName: string;
        lastName: string;
      }[];
    };
  };
};

type ResponseKeys = keyof APIResponse; // 'user'
type UserKeys = keyof APIResponse['user']; // 'userId' | 'friendList'
```

키인 문법과 keyof 연산자를 혼합해 사용하면 객체에서 주어진 키에 해당하는 값을 반환하는 게터를 안전하게 구현할 수 있습니다.

```ts
type ActivityLog = {
  lastEvent: Date;
  events: {
    id: string;
    timestamp: Date;
    type: 'Read' | 'Write';
  }[];
};

const activityLog: ActivityLog = {
  lastEvent: new Date(),
  events: [
    {
      id: 'ab',
      timestamp: new Date(),
      type: 'Read',
    },
  ],
};

// 오버로드
// 최대 세 개의 키로 호출할 수 있도록 오버로드 한 타입
type Get = {
  <O extends object, K1 extends keyof O>(o: O, k1: K1): O[K1];

  <O extends object, K1 extends keyof O, K2 extends keyof O[K1]>(
    o: O,
    k1: K1,
    k2: K2
  ): O[K1][K2];

  <
    O extends object,
    K1 extends keyof O,
    K2 extends keyof O[K1],
    K3 extends keyof O[K1][K2]
  >(
    o: O,
    k1: K1,
    k2: K2,
    k3: K3
  ): O[K1][K2][K3];
};

const get: Get = (object: any, ...keys: string[]) => {
  let result = object;
  keys.forEach(k => (result = result[k]));
  return result;
};

get(activityLog, 'events', 0, 'type'); // "Read" | "Write"
```

### Mapped types(매핑된 타입)

매핑된 타입은 객체의 키와 값을 매핑하는 수단을 제공하는 타입스크립트의 문법입니다.

```ts
type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
type Day = Weekday | 'Sat' | 'Sun';

type Mapped = { [K in Weekday]: Day };
```

key 부분을 살펴보면 in 키워드가 존재하는데, 객체의 key를 순회하는 루프 문으로 자바스크립트의 `for in` 문을 생각하면 편합니다.

매핑된 타입을 활용해 다양한 유틸리티 타입을 생성할 수 있습니다.

```ts
type Account = {
  id: number;
  isEmployee: boolean;
};

// 모든 필드를 optional로 만듦
type OptionalAccount = {
  [K in keyof Account]?: Account[K];
};

// 모든 필드를 nullable로 만듦
type NullableAccount = {
  [K in keyof Account]: Account[K] | null;
};

// 모든 필드를 읽기 전용으로 만듦
type ReadonlyAccount = {
  readonly [K in keyof Account]: Account[K];
};

// 모든 필드를 다시 쓸 수 있게 만듦
type Account2 = {
  -readonly [K in keyof ReadonlyAccount]: Account[K];
};

// 모든 필드를 다시 필수로 만듬
// 매핑된 타입에서만 사용할 수 있는 마이너스 연산자(-)로 optional(?)과 readonly를 제거할 수 있다.
type Account3 = {
  [K in keyof OptionalAccount]-?: Account[K];
};
```

지금까지 소개한 매핑된 타입은 매우 유용해 타입스크립트가 많은 것을 내장 타입으로 제공하고 있습니다.

#### Record<K, V>

`{ key: type }`을 쌍으로 갖는 요소를 매핑할 수 있습니다.

```ts
type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
type Day = Weekday | 'Sat' | 'Sun';

type MyRecord = Record<Weekday, Day>;
```

#### Partial<Object>

모든 필드를 optional로 바꿔줍니다.

```ts
type MyPartial = Partial<MyRecord>;
```

#### Required<Object>

모든 필드를 필수로 바꿔줍니다.

```ts
type MyRequired = Required<MyRecord>;
```

#### Readonly<Object>

모든 필드를 읽기 전용으로 바꿔줍니다.

```ts
type MyReadonly = Readonly<MyRecord>;
```

#### Pick<Object, Keys>

특정 속성만 선택해 새로운 타입을 생성합니다.

```ts
type MyPick = Pick<MyRecord, 'Mon' | 'Tue'>;
```

### 컴패니언 객체 패턴

타입스크립트에는 타입과 객체를 쌍으로 묶는, 컴패니언 객체 패턴과 비슷한 기능의 패턴이 존재합니다.
타입과 값은 다른 네임스페이스를 사용하므로 같은 이름으로 타입과 값을 선언할 수 있습니다.

이 패턴으로 타입과 값 정보를 작성하면, 한 개의 이름으로 타입과 값을 `import` 할 수 있습니다.

```ts
type Currency = {
  unit: 'EUR' | 'GBP' | 'JPY' | 'USD';
  value: number;
};

const Currency = {
  DEFAULT: 'USD',
  from(value: number, unit = Currency.DEFAULT): Currency {
    return { unit, value };
  },
};

export default Currency;
```

```ts
import Currency from './Currency';

// 타입으로 사용
const amountDue: Currency = {
  unit: 'JPY',
  value: 83832.1,
};

// 값으로 사용
const otherAmountDue = Currency.from(330, 'EUR');
```

## 고급 타입 함수들

### 튜플의 타입 추론 개선

타입스크립트는 튜플의 타입에 대해 관대한 편입니다.<br>
타입스크립트가 튜플을 추론할 때 최대한 일반적으로 추론합니다. 하지만 더 엄격한 추론이 필요한 경우가 있습니다.

엄격한 추론이 필요한 경우 엄격한 추론을 위해 타입 어설션(as type) 또는 as const 어설션을 사용할 수 있습니다.
이 두개를 사용하지 않고 튜플을 엄격하게 추론하기 위해서는 어떻게 해야할까요?

```ts
function tuple<T extends unknown[]>(...ts: T): T {
  return ts;
}

const array = tuple('a', 3, 'c'); // [string, number, string]
```

위 방식으로 튜플 타입이 많이 등장하는 경우 타입 어설션 사용을 줄일 수 있습니다.

### 사용자 정의 타입 안전 장치

```ts
function isString(a: unknown): boolean {
  return typeof a === 'string';
}

function parseInput(input: string | number) {
  let formattedInput: string;
  if (isString(input)) {
    formattedInput = input; // 'string | number' 형식은 'string' 형식에 할당할 수 없습니다.
  }
}
```

위 코드에서 `formattedInput`이라는 `string` 타입을 기대하는 변수에 매개변수로 받는 `input`을 `string` 타입으로 정제한 것처럼 보이지만, 타입스크립트는 여전히 `string | number` 타입으로 추론하고 있습니다.

타입스크립트의 추론은 강력하지만, 타입스크립트가 관찰할 수 있는 영역을 벗어나면 무용지물입니다.

`parseInput` 함수 입장에서의 `isString` 함수는 그저 `boolean`을 반환하는 함수이므로 타입스크립트는 값을 정제할 수 없습니다.

이런 경우 사용자 정의 타입 안전장치를 사용할 수 있습니다.
사용자 정의 타입 안전장치를 사용하기 위해 `is` 연산자를 사용합니다.

```ts
function isString(a: unknown): a is string {
  return typeof a === 'string';
}

function parseInput(input: string | number) {
  let formattedInput: string;
  if (isString(input)) {
    formattedInput = input;
  }
}
```

이제 타입스크립트는 `isString` 함수가 `unknown` 형식의 매개변수가 `string`인지 확인하고 `boolean`을 반환하는 함수임을 알 수 있기 때문에 `input` 매개변수의 타입을 `string`으로 좁힐 수 있습니다.

## 조건부 타입

조건부 타입이란 조건부로 타입을 할당하는 타입스크립트의 기능을 말합니다.

```ts
// 타입 수준의 연산을 수행한다.
type IsString<T> = T extends string ? true : false;

type A = IsString<'a'>; // true
type B = IsString<10>; // false
```

### 분배적 조건부

만약 `string | number` 타입의 유니온을 조건부 타입 `IsString`에 전달하면 어떻게 될까요?

```ts
type C = IsString<string | number>;
```

`string | number는` `string`의 슈퍼타입이니 참을 반환할까요? 타입스크립트는 이를 `boolean`으로 추론합니다.

이와 같은 결과가 반환되는 이유는 유니온으로 묶인 타입 하나씩 풀어 조건부 타입 검사를 하고 그 결과값을 다시 묶어 유니온으로 반환하기 때문입니다.

조건부 타입이 유니온 타입을 검사하는 과정을 순서대로 보겠습니다.

```ts
1. (string | number) extends string ? true : false
2. string extends string ? true : false | number extends string ? true : false;
3. true | false
```

### infer

infer는 타입의 추론을 가능하게 해주는 마법같은 키워드입니다.
조건의 일부를 제네릭 타입으로 선언할 수 있다고 생각하면 됩니다.

```ts
type SecondArg<F> = F extends (a: any, b: infer B) => any ? B : never;

type A = SecondArg<(a: string, b: number) => {}>;
```

컴파일 과정에서 타입을 명시하지 않더라도, 혹은 명시하는 것이 비효율적인 경우 infer를 활용할 수 있습니다.

```ts
type ElementType<T> = T extends unknown[] ? T[number] : T;
type F = ElementType<number[]>;

// infer를 활용해 다시 구현해보자.
type ElementType2<T> = T extends (infer U)[] ? U : T;
type G = ElementType2<number[]>;
```

### 내장 조건부 타입

#### Exclude<T1, T2>

유니온 타입에서 T1에서 T2를 제외한 타입을 생성하는 타입

```ts
type T1 = string | number | boolean;
type T2 = number | string;
type A = Exclude<T1>; // boolean
```

#### Extract<T1, T2>

T1의 타입 중 T2에 할당할 수 있는 타입을 생성하는 타입

```ts
type T1 = number | string;
type T2 = string;
type A = Extract<T1, T2>; // string
```

#### NonNullable<T>

T에서 null과 undefined를 제외한 타입을 생성하는 타입

```ts
type T = number | null | undefined;
type A = NonNullable<T>; // number
```

#### ReturnType<F>

함수의 반환 타입을 반환하는 타입

```ts
function foo(): string | number {}

type A = ReturnType<typeof foo>; // string | number
```

## 어설션

### 타입 어설션

as(assertion) 키워드를 통해 타입스크립트에게 `이 변수는 이런 타입이야`라고 표현할 수 있습니다.(단언)

```ts
function formatInput(input: string) {}

function getUserInput(): string | number {}

const input = getUserInput();

// 아래 두 어설션은 같은 동작을 합니다.
formatInput(input as string);
formatInput(<string>input);
```

```ts
function formatArray(array: any[]) {}

formatArray({} as string[]);
```

`any`로 타입을 어설션 해 타입을 우회할 수 있지만 굉장히 위험하므로 되도록 피해야 합니다.

### Nonnull 어설션

Nonnull 어설션을 통해서 타입스크립트에게 어떠한 값이 null 또는 undefined가 아님을 확인시켜줄 수 있습니다. 변수명 뒤에 느낌표 연산자를 붙혀 사용할 수 있습니다.

```ts
function someFunc(arg: string) {}

function nonNull(nullableObj: { id?: string }) {
  if (!nullableObj.id) {
    return;
  }

  // 즉시 실행함수에서는 참조할 수 있음
  (() => {
    someFunc(nullableObj.id);
  })();

  // 화살표 함수 내부에서는 참조할 수 없음
  const arrowFunc = () => {
    someFunc(nullableObj.id); // 'string | undefined' 형식의 인수는 'string' 형식의 매개 변수에 할당될 수 없습니다
  };
}
```

위 예시에서 제어 흐름에 따르면 nullableObj의 id가 존재하는지 조건문을 통해 확인하여 하위 코드에 접근할 수 없도록 설계했지만 화살표 함수는 새로운 제어 흐름을 만들어내기 때문에, 화살표 함수 내부에서 nullableObj의 id가 존재하는지 타입스크립트는 확신할 수 없습니다.

이런 경우 Nonnull 어설션을 활용할 수 있습니다.

```ts
function someFunc(arg: string) {}

function foo(nullableObj: { id?: string }) {
  if (!nullableObj.id) {
    return;
  }

  const arrowFunc = () => {
    someFunc(nullableObj.id!); // Nonnull 어설션을 통해 null이나 undefined가 아님을 알림
  };
}
```

### Definite Assignment 어설션

확실한 할당 어설션은 이 변수가 반드시 할당될 것임을 타입스크립트에 알려주는 어설션입니다. 타입 어노테이션 앞에 느낌표 연산자를 붙혀 사용할 수 있습니다.

```ts
function namingUser() {
  username = 'abc';
}

let username: string;
namingUser();
username.toUpperCase(); // 'username' 변수가 할당되기 전에 사용되었습니다.
```

프로그래머가 변수가 할당되어 있음을 알고 있는 경우에 다음과 같이 사용할 수 있습니다.

```ts
function namingUser() {
  username = 'abc';
}

let username!: string; // 반드시 할당되어 있을 것임을 미리 선언
namingUser();
username.toUpperCase();
```

## 이름 기반 타입 시스템 흉내내기

타입스크립트는 구조 기반 타입 시스템을 지원하지만 이름 기반 타입 시스템을 흉내낼 수 있습니다.

```ts
type CompanyId = string;
type UserId = string;
type OrderId = string;

type ID = CompanyId | UserId | OrderId;

function parseCompanyId(companyId: CompanyId) {
  // ...
}

const companyId: CompanyId = 'abc';
parseCompanyId(companyId);
```

`parseCompanyId` 함수는 매개변수로 `CompanyId` 타입만을 전달받고 싶어하지만, 모두 `string` 타입의 서브타입이기에 `CompanyId` 타입만을 받아 처리할 수 없습니다.

위와 같은 상황이 이름 기반 타입이 유용한 상황입니다. 임의의 타입 브랜드를 만들어(타입 브랜딩) 이름 기반 타입을 흉내낼 수 있습니다.

```ts
type CompanyId = string & { readonly brand: unique symbol };
type UserId = string & { readonly brand: unique symbol };
type OrderId = string & { readonly brand: unique symbol };

function CompanyId(id: string) {
  return id as CompanyId;
}

function UserId(id: string) {
  return id as UserId;
}

function OrderId(id: string) {
  return id as OrderId;
}

function parseCompanyId(companyId: CompanyId) {
  // ...
}

parseCompanyId(UserId('abc')); // 'UserId' 형식의 인수는 'CompanyId' 형식의 매개 변수에 할당될 수 없습니다.
```

이 예시는 brand를 unique symbol로 선언해 사용합니다.<br>
unique symbol은 타입스크립트에서 지원하는 두 가지 이름 기반 타입 중 하나이기 때문입니다. (나머지 하나는 열거형)<br>

런타임 오버헤드가 없다는 것이 이 기법의 장점입니다.<br>
런타임에 ID는 그저 string이기에 `brand`는 온전히 컴파일 타임에만 쓰입니다.

## 프로토타입 안전하게 확장

자바스크립트의 프로토타입을 확장하는 것은 안전하지 않다고 알려져 있습니다. 타입스크립트의 정적 타입 시스템을 이용하면 안전하게 확장할 수 있습니다.

```ts
function tuple<T extends unknown[]>(...ts: T): T {
  return ts;
}

// 선언 합침을 통해 타입스크립트에 zip이 무엇인지 설명
interface Array<T> {
  zip<U>(list: U[]): [T, U][];
}

Array.prototype.zip = function <T, U>(this: T[], list: U[]): [T, U][] {
  return this.map((v, i) => tuple(v, list[i]));
};
```

배열의 프로토타입에 기능을 추가하려면 zip 함수를 사용하는 모든 파일이 zip.ts를 먼저 로드해야 합니다. 그러기 위해서 tsconfig.json에 다음 코드를 추가할 수 있습니다.

```
{
  "exclude": ["./zip.ts"],
}
```

tsconfig.json의 exclude 설정에 './zip.ts' 파일을 추가하면, TypeScript 컴파일러는 ./zip.ts' 파일을 컴파일 대상에서 제외합니다. 즉, 이 파일은 TypeScript 컴파일러에 의해 변환되지 않습니다.

하지만 다른 파일이 이 './zip.ts' 파일을 import하면, TypeScript 컴파일러는 이 ./zip.ts 파일을 다시 컴파일합니다. 이때 import 구문이 있는 파일은 './zip.ts' 파일이 먼저 컴파일된 후에 컴파일됩니다.

그러므로 zip이라는 기능을 사용하는 파일은, './zip.ts'가 먼저 컴파일 된 이후에 컴파일 되기 때문에 zip 기능을 안전하게 사용할 수 있습니다.
