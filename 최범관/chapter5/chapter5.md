# Chapter5 - 클래스

## 접근 제어자

타입스크립트는 클래스의 프로퍼티와 메서드에 세 가지의 접근 제어자를 제공합니다.

### public

어디에서든지 접근할 수 있습니다.

### private

해당 클래스의 인스턴스에서만 접근할 수 있습니다.

### protected

해당 클래스와 서브 클래스의 인스턴스에서만 접근할 수 있습니다.

## 추상 클래스

`abstract` 키워드를 통해 추상 클래스를 생성할 수 있습니다.<br>
추상 클래스는 인스턴스를 생성할 수 없고 상속에만 사용할 수 있습니다.

추상 클래스 내부에 추상 메서드가 존재한다면 상속을 받는 클래스에서 메서드의 세부 구현을 작성해야 합니다.

```ts
abstract class Parent {
  abstract doSomeThing(): void;
}

class Child extends Parent {
  doSomeThing() {
    console.log('hello');
  }
}
```

## this를 반환 타입으로 사용하기

this를 값뿐이 아니라 타입으로도 사용할 수 있습니다.

```ts
class Set {
  add(value: number): this {
    // ...
  }
}
```

## 인터페이스

```ts
interface User {
  name: string;
  age: number;
}
```

인터페이스를 사용하면 타입을 더 깔끔하게 정의할 수 있습니다.

### 타입 별칭과 인터페이스의 차이점

타입 별칭은 타입 표현식(&, | 등 타입 연산자)를 포함한 모든 타입이 등장할 수 있으나 인터페이스는 반드시 객체의 형태로 정의해야 합니다.

인터페이스를 상속할 때 인터페이스의 타입에 상위 인터페이스를 할당할 수 있는지 확인합니다. 하지만 타입 별칭에서 인터섹션 타입을 사용하면 확장하는 타입을 최대한 조합하는 방식으로 동작합니다.

```ts
interface A {
  good(x: number): string;
  bad(x: number): string;
}

/**
 * 'B' 인터페이스가 'A' 인터페이스를 잘못 확장합니다.
 * 'bad' 속성의 형식이 호환되지 않습니다.
 * '(x: string) => string' 형식은 '(x: number) => string' 형식에 할당할 수 없습니다.
 * 'x' 및 'x' 매개 변수의 형식이 호환되지 않습니다.
 * 'number' 형식은 'string' 형식에 할당할 수 없습니다.
 */
interface B extends A {
  good(x: string | number): string;
  bad(x: string): string;
}
```

타입스크립트에서는 인터페이스를 확장할 때, 기존 메소드의 매개변수 타입을 다른 타입으로 변경하는 것을 허용하지 않습니다.

## 선언 합침

선언 합침은 같은 이름으로 선언된 여러 정의를 자동으로 합치는 타입스크립트의 기능입니다. 타입 별칭의 경우에는 중복된 식별자임을 컴파일 타임에 타입스크립트가 에러를 내지만 인터페이스의 경우에는 에러를 내지 않고 두개의 선언을 하나로 합칩니다. 이를 선언 합침이라고 부릅니다.

```ts
interface User {
  name: string;
}

interface User {
  age: number;
}

// User는 name과 age 두 개의 필드를 가짐
const human: User = {
  name: 'abc',
  age: 20,
};
```

## implements

객체나 배열등에 타입을 지정한 것 처럼, 클래스에서는 `implements`라는 키워드를 이용해 특정 인터페이스를 만족시킴을 표현할 수 있습니다.

이 문법을 통해 어댑터, 팩토리, 전략 패턴과 같은 디자인 패턴을 구현할 수 있다.

```ts
interface Animal {
  eat(food: string): void;
  sleep(hours: number): void;
}

class Cat implements Animal {
  eat(food: string) {
    console.info('Ate some', food);
  }
  sleep(hours: number) {
    console.info('Slept for', hours, 'hours');
  }
}
```

Cat은 Animal 클래스가 선언하는 모든 메서드를 구현해야 하며, 필요하다면 메서드나 프로퍼티를 추가로 구현할 수 있다.

인터페이스로 클래스의 인스턴스 프로퍼티를 정의할 수 있지만 접근 제어자를 사용할 수 없다.

하나의 클래스는 여러개의 인터페이스를 구현할 수 있다.

```ts
interface Animal {
  eat(food: string): void;
  sleep(hours: number): void;
}

interface Feline {
  meow(): void;
}

class Cat implements Animal, Feline {
  eat(food: string) {
    console.info('Ate some', food);
  }
  sleep(hours: number) {
    console.info('Slept for', hours, 'hours');
  }
  meow() {
    console.info('Meow');
  }
}
```

## 추상 클래스 상속 vs 인터페이스 구현

인터페이스는 컴파일 타임에만 존재하는 반면, 추상 클래스는 런타임의 자바스크립트 클래스 코드를 만듭니다.

인터페이스는 객체, 배열, 함수, 클래스, 클래스 인스턴스를 정의할 수 있지만 추상 클래스는 오직 클래스만 정의할 수 있습니다.

인터페이스는 특정 구조를 강제하고 싶을 때, 추상 클래스는 공통된 구현을 재사용하면서 일부 메소드는 자식 클래스에서 오버라이드 하고 싶을 때 사용합니다.

## typeof

자바스크립트에는 값 수준의 typeof가 있듯이 타입스크립트에서는 타입 수준의 typeof가 존재합니다.

```ts
function f() {
  return { x: 10, y: 3 };
}

type P = ReturnType<typeof f>;

// type P = {
//     x: number;
//     y: number;
// }
```

## 제네릭

클래스에서도 제네릭을 사용할 수 있습니다.
제네릭 타입의 범위는 클래스나 인터페이스 전체가 되게 할 수도 있고 특정 메서드로 한정할 수도 있습니다.

클래스와 함께 선언된 제네릭은 클래스 내부 어디에서나 사용할 수 있습니다.

```ts
class MyMap<K, V> {
  constructor(initKey: K, initVal: V) {}

  get(key: K): V {
    // ...
  }
}
```

인스턴스 메서드는 클래스 수준 제네릭을 사용할 수 있고, 자신만의 제네릭도 추가로 선언할 수 있습니다.

정적 메서드는 인스턴스의 변수에 접근할 수 없듯이 클래스 수준의 제네릭을 사용할 수 없습니다.

```ts
class MyMap<K, V> {
  constructor(initKey: K, initVal: V) {}

  get(key: K): V {
    // ...
  }
  merge<K1, V1>(map: MyMap<K1, V1>): MyMap<K | K1, V | V1> {
    // ...
  }
  static of<K, V>(k: K, v: V): MyMap<K, V> {
    // ...
  }
}
```

## 믹스인

타입스크립트에서 클래스는 단 한번만 상속 받을 수 있습니다.

타입스크립트에서 다중 상속을 구현하기 위해, 상속의 개념이 아닌 기존의 클래스를 재구성하는 형태의 믹스인을 사용할 수 있습니다.

```ts
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

class User {
  constructor(public name: string) {}
}

const TimestampedUser = Timestamped(User);

const user = new TimestampedUser('name');
```

## 데코레이터

데코레이터는 말 그대로 코드 조각을 장식해주는 역할을 하는 일종의 함수입니다.

메소드, 클래스, 프로퍼티, 파라미터 위에 `@함수`를 장식함으로써 런타임에 데코레이터 함수가 실행되어 코드를 장식해주는 것입니다.

```ts
function readonly(writable: boolean) {
  return function (target:any, decoratedPropertyName: any): any {
    return writable: !writable,
  }
}
```

## final 클래스

생성자를 private로 선언하면 인스턴스를 생성하거나 클래스를 확장할 수 없게 됩니다.

```ts
class FinalClass {
  private constructor() {}
}
```

클래스 상속만 막아야 하지만 생성자를 private로 선언하게 되면 클래스를 인스턴스화 하는 기능까지 사라집니다.
이런 경우 자기 자신을 반환하는 static 메서드를 통해 해결할 수 있습니다.

```ts
class FinalClass {
  private constructor() {}
  static create() {
    return FinalClass();
  }
}
```

## 디자인 패턴

### 팩토리 패턴

팩토리 패턴은 어떤 객체를 만들지를 전적으로 팩토리에 위임하는 패턴입니다.
