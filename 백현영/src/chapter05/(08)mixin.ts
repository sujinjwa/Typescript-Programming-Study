// ---mixin---
// : 다중상속을 가능하게 해준다.
// 장점 : 상속보단 합성을 사용하는게 결합도를 낮추고 유연한 코드를 만들 수 있다.
// trait은 메서드만 합성, mixin은 메서드와 프로퍼티 모두 합성
// HOC 패턴과 유사하네...

// rule
// 1. 상태를 갖을 수 있다. (e.g. 인스턴스 프로퍼티)
// 2. 구체 메서드만 제공한다.(추상메서드는 제공하지 않는다.)
// 3. 생성자를 가질 수 있다. (클래스가 혼합된 순서와 같은 순서로 생성자가 실행된다.)

type ClassConstructor = new (...args: any[]) => {}; // 최소한의 구조를 가진 객체를 반환한다
// (구조적 타이핑을 따르는 타입스크립트 이므로 빈객체에는 어떤 객체(최소한 객체 모양을 가진)든 올 수 있다)

function withFly<C extends ClassConstructor>(baseClass: C) {
  return class extends baseClass {
    constructor(...args: any[]) {
      super(...args);
    }

    fly() {
      const name = this.constructor.name;
      console.log(`${name} is flying`);
    }
  };
}

class Person {}
28;

const FlyPersonClass = withFly(Person);
const person = new FlyPersonClass();
person.fly();

// startFly메서드를 강제하려면 ? (단, mixin은 구체메서드만 제공한다.)

type ForceMethodCLassConstructor<T> = new (...args: any[]) => T;

function withForceStartFly<
  C extends ForceMethodCLassConstructor<{
    getDestinationInfo(): {
      from: string;
      to: string;
      distance: number;
    };
  }>
>(baseClass: C) {
  return class extends baseClass {
    constructor(...args: any[]) {
      super(...args);
    }

    fly() {
      const name = super.constructor.name;
      const { to, distance } = this.getDestinationInfo();
      console.log(`${name} is flying, ${distance} to ${to}`);
    }
  };
}

// ❌
// class withoutStartFlyPerson {}
// const FlyPersonClass2 = withForceStartFly(withoutStartFlyPerson);

// ✅
class Traveler {
  private from: string;
  private to: string;
  private distance: number;

  constructor(from: string, to: string, distance: number) {
    this.from = from;
    this.to = to;
    this.distance = distance;
  }

  getDestinationInfo() {
    return {
      from: this.from,
      to: this.to,
      distance: this.distance,
    };
  }
}
const 김옥지 = withForceStartFly(Traveler);
const person2 = new 김옥지('대전', '서울', 486);
person2.fly();

export {};
