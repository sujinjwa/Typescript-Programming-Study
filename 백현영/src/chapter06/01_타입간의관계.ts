// --------------------subtype, supertype--------------------
// https://velog.velcdn.com/images/pung8146/post/609a48d1-877b-49a5-b4b0-b0de806cb0ce/image.png

// 서버에 저장된 사용자 타입
type ExistingUser = {
  id: number;
  name: string;
};

// 아직 서버에 보내지 않은 사용자 타입
type NewUser = {
  name: string;
};

function deleteUser(user: { id?: number; name: string }) {
  delete user.id;
}

const existingUser: ExistingUser = {
  id: 123456,
  name: 'gosling',
};

deleteUser(existingUser); // -> 기대되는 타입의 서브타입이기에 가능하다 옵셔널은  (number | undefined) 이므로 Super

// 🤔
existingUser.id; // 여전히 id가 존재한다고 추론한다.
// supertype을 기대하는 곳에 사용하는것은 안전하지 않다
// -> 타입스크립트가 완벽함보다 에러가 발생하는 이유를 쉽게 전달하기 위한 실용성 보장 위해 설계됨

// 단, 서브타입(기대하는타입)에 supertype 할당은 불가능하다.
type LegacyUser = {
  id?: number | string;
  name: string;
};

const legacyUser: LegacyUser = {
  id: 123456, // string은 당연히 안되고 심지어 number도 안된다.
  name: 'gosling',
};

// ❌
// deleteUser(legacyUser); // 기대하는 타입보다 LegacyUser라고 선언된 타입은 기대하는 타입보다 Super 타입이기에 Erorr !

// --- summary ---
// 함수의 매개변수만 제외하고 모두 공변성을 띈다.

// --- 가변성 ---
// 1. 불편 : T를 원함
// 2. 공변 : <:T 를 원함 (우항의 서브타입을 원함 : T의 프로퍼티를 **일부** 가지고 있음)
// 3. 반변 : >:T 를 원함 (좌항의 수퍼타입을 원함 : T의 프로퍼티를 **모두** 가지고 있음)
// 4. 양변 : <:T or >:T 를 원함 (이건 불변아닌감?)

// ---------------------------------------------------------------
// ⭐️ 타입스크립트에서 함수 매개변수 (함수'의' 매개변수가 아니다)만 예외적으로 반변
// 모든 복합 타입의 멤버는 공변(객체, 클래스, 배열, 함수, 반환타입 등등..)
// 위의 코드로 설명하자면 deleteUser의 경우 기대하는 타입은 서브타입이거나 같은 타입이다.
// 반대로 legacyUser의 경우 할당될 객체의 타입의 범위는 SuperType이거나 같은타입을 원한다
// ---------------------------------------------------------------

// --- 함수 가변성 ---
// 함수 A가 함수 B와 같거나 매개변수가 B보다 적은 수의 프로퍼티를 가지며 다음을 만족하면 Sub타입이다.
// 1. A의 this를 따로 지정하지 않으면 A >: B this 타입이다.
// 2. A의 매개변수에 대해 >: 을 띈다
// 3. 반환타입은 A <: B 이다.

// Crow <: Bird <: Animal
class Animal {}

class Bird extends Animal {
  chirp() {}
}

class Crow extends Bird {
  caw() {}
}

function chirp(bird: Bird): Bird {
  bird.chirp();
  return bird;
}

// ✅
chirp(new Bird());
chirp(new Crow());

// ❌
// chirp(new Animal());

// 여기까지는 일반적인 반변성 띈다.

function clone(callbackFn: (b: Bird) => Bird): void {
  // ...
}

function birdToBird(bird: Bird): Bird {
  return new Bird();
}

function birdToCrow(bird: Bird): Crow {
  return new Crow();
}

function birdToAnimal(bird: Bird): Animal {
  return new Animal();
}

// ✅
clone(birdToBird);
clone(birdToCrow);

// ❌
// clone(birdToAnimal);

// 어째서 여기선 안될까 ?
// 만약 clone의 구현이 다음과 같다면 ?
// (b : Bird) => Animal 함수가 들어왔을때 Bird.chirp()를 호출할 수 없다.
// 다시말해 반환타입(공변성을 띔)이 <:T 를 만족해야한다.
// 여기서는 '서브타입 함수의 반환 타입 <: 다른 함수의 반환 타입'을 만족해야한다
function clone2(callbackFn: (b: Bird) => Bird): void {
  const parent = new Bird();
  const babyBird = callbackFn(parent);
  babyBird.chirp();
}

// 그렇다면 매개변수는 ?
function animalToBird(animal: Animal): Bird {
  return new Bird();
}

// ✅
clone2(animalToBird);

function crowToBird(crow: Crow): Bird {
  crow.caw();
  return new Bird();
}

// ❌
// caw가 Bird에 없다.
// clone2(crowToBird);

// --- summary ---
// this와 매개변수는 반변성을 띈다.
// 반환타입은 공변성을 띈다
// 즉, 함수 매개변수를 받으려면 'this를 포함한 매개변수 타입 >: 대응 매개변수 타입' 이다.

// ------------------ type widening ------------------

let a = null; // any
a = 3;
a = 'hello';

// const를 이용하면 타입 넓히기가 중지됨
const b = null; // null

// ❌
// b = 3;

// 신선한 객체(리터럴로 fresh하게 만든...)에 대해 초과 프로퍼티 검사 (잉여속성검사)
// 가변성 챕터에서 객체는 공변성을 띈다고 했다.
// 그렇다면 슈퍼타입을 만족하는 서브타입을 할당할 수 있어야한다.

type PersonAttr = {
  name: string;
  age?: number;
  gender?: 'male' | 'female';
};

class Person {
  constructor(public config: PersonAttr) {}
}

// 아래와 같이 오타가 있을 수 있으므로 타입스크립트는 이를 방지하기 위해 초과 프로퍼티 검사를 한다.
// onclick, onClick, onclikc 등등.. 오타가 있을 수 있으므로

// ❌
// new Person({
//   name: 'a',
//   genderrrrr: 'male',
// });

// 🤔 아래와 같이 공변성은 만족한다. 그러나 초과 프로퍼티 검사를 통과하지 못한다.
interface PersonAttr2 {
  name: string;
  age: number;
}

const per = {
  name: 'gosling',
  age: 28,
  gender: 'male',
};

const gosling: PersonAttr2 = per;

// example
// 신선한 객체 전달했음
// 어째서 신선한 객체인가? -> 전달한 객체는 **추론**된 타입
// 왜? -> 변수에 할당하지 않았으니까
// 다시말해, 타입 assertion이 되지않은 상태 단순 추론상태

// ❌
// new Person({
//   name: 'a',
//   genderrrrrr: 'female',
// });

// ✅
const personAttr = {
  name: 'minji',
  height: 160,
};

// 신선한 객체가 아니므로 잉여속성검사를 통과한다.
// 또한 공변성을 만족하므로 수퍼타입을 만족하는 서브타입을 할당할 수 있다.

new Person(personAttr);

// ------------------ type refinement(정제) ------------------
// 제어문에 따라 타입스크립트가 타입을 좁혀(정제)해 나가는 것
// 타입가드와 같은 개념

// make example
type Unit = 'cm' | 'px' | '%';

const units: Unit[] = ['cm', 'px', '%'];

function parseUnit(value: string): Unit | null {
  for (const unit of units) {
    if (value.endsWith(unit)) {
      return unit;
    }
  }
  return null;
}

type Width = {
  unit: Unit;
  value: number;
};

// 각각의 width에 마우스를 올려보자 !
function parseWidth(width: number | string | null | undefined): Width | null {
  // string | number | null | undefined
  if (width == null) {
    return null;
  } // 정제완료 !

  // stirng | number
  if (typeof width === 'number') {
    return { unit: 'px', value: width };
  } // 정제완료 !

  // string
  const unit = parseUnit(width);
  if (unit) {
    return { unit, value: parseFloat(width) };
  }

  return null;
}

// 복잡한 유니온타입도 정제해보자 !

// (simple example)

// type UserTextEvent = { value: string };
// type UserMouseEvent = { value: [number, number] };

// type UserEvent = UserTextEvent | UserMouseEvent;

// function handle(event: UserEvent) {
//   if (typeof event.value === 'string') {
//     event.value; // stirng
//     return;
//   }

//   // 정제 완료 !
//   event.value; // [number, number]
// }

// complex example !
type UserTextEvent = { value: string; target: HTMLInputElement };
type UserMouseEvent = { value: [number, number]; target: HTMLElement };

type UserEvent = UserTextEvent | UserMouseEvent;

function handle(event: UserEvent) {
  if (typeof event.value === 'string') {
    event.value; // string
    event.target; // HTMLInputElement | HTMLElement (???)
    return;
  }

  event.value; // [number, number]
  event.target; // HTMLElement | HTMLInputElement (???)
}
// 엄밀히 말하자면 UserEvent만 받겠다는게 아니다, UserEvent타입이면 무엇이든 받겠다는 의미이다.
// 유니온 멤버가 서로 중복될 수 있으므로 넓게 파악한다

// 태깅(마킹이었나?) 을 사용하는 방식으로 해결할 수 있다
// 보통은 리터럴 타입을 사용
// 태그는 제네릭을 타입을 받지않는다

type BetterUserTextEvent = {
  type: 'TextEvent';
  value: string;
  target: HTMLInputElement;
};
type BetterUserMouseEvent = {
  type: 'MouseEvent';
  value: [number, number];
  target: HTMLElement;
};

type BetterUserEvent = BetterUserTextEvent | BetterUserMouseEvent;

function betterHandle(event: BetterUserEvent) {
  if (event.type === 'TextEvent') {
    event.value; // string
    event.target; // HTMLInputElement
    return;
  }

  event.value; // [number, number]
  event.target; // HTMLElement
}

export {};
