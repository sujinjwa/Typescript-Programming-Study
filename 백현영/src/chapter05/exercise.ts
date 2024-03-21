import { BalletFlat, Boot, Sneaker } from './11_designPattern';

// 1. 클래스와 인터페이스의 차이는 무엇인가?
// : 클래스는 타입과 값 모두를 가질 수 있지만 인터페이스는 타입만을 가질 수 있다.

// 2. 생성자를 protected로 하면 ?
// 예상 : private와 동일하다.
class Person {
  protected constructor(public name: string) {}
}

// 정답 : 상속은 가능하지만 인스턴스 생성은 불가능하다. (final과 반대네)

// ✅
class SubPerson extends Person {}

//❌
// const person = new Person()

// 3. 추상화레벨이 높아지지만 안전성을 높여보자

interface Shoe {
  purpose: string;
}

interface ShoeCreator {
  create(type: 'balletFlat'): BalletFlat;
  create(type: 'boot'): Boot;
  create(type: 'sneaker'): Sneaker;
}

let Shoe: ShoeCreator = {
  create(type: 'balletFlat' | 'boot' | 'sneaker'): Shoe {
    switch (type) {
      case 'balletFlat':
        return new BalletFlat();
      case 'boot':
        return new Boot();
      case 'sneaker':
        return new Sneaker();
      default:
        throw new Error('Unknown shoe type'); // 컴파일타임에 막히긴 하나 그래도 런타임에는 에러가 발생할 수 있다.
    }
  },
};

Shoe.create('balletFlat'); // BalletFlat

// 4. Url과 method를 설정했을때만 send를 보낼 수 있게 순서를 보장해보자
interface BuildableRequest {
  data?: object;
  method: 'get' | 'post';
  url: string;
}

class RequestBuilder2 {
  data?: object;
  method?: 'get' | 'post';
  url?: string;

  setData(data: object): this & Pick<BuildableRequest, 'data'> {
    return Object.assign(this, { data });
  }

  setMethod(method: 'get' | 'post'): this & Pick<BuildableRequest, 'method'> {
    return Object.assign(this, { method });
  }

  setURL(url: string): this & Pick<BuildableRequest, 'url'> {
    return Object.assign(this, { url });
  }

  build(this: BuildableRequest) {
    return this;
  }
}

// ✅ 순서를 보장해야한다. 라고 했는데.. 순서보단 build 이전에 모든것들이 set 되어야한다는 의미같다.
new RequestBuilder2()
  .setData({}) // 얘도 보장해야한다면 interface에서 옵셔널을 지워주자
  .setMethod('post') // 제거시 에러
  .setURL('bar') // 제거시 에러
  .build();

// 순서를 보장하는 방법
class Car {
  constructor(
    private wheels?: number,
    private engine?: string,
    private seats?: number
  ) {}
}

class CarBuilder {
  wheels?: number;
  seats?: number;
  engine?: string;

  setWheels(wheels: number): CarEngineBuilder {
    this.wheels = wheels;
    return new CarEngineBuilder(this);
  }

  build(): Car {
    return new Car(this.wheels, this.engine, this.seats);
  }
}

class CarEngineBuilder {
  private builder: CarBuilder;

  constructor(builder: CarBuilder) {
    this.builder = builder;
  }

  setEngine(engine: string): CarSeatsBuilder {
    this.builder.engine = engine;
    return new CarSeatsBuilder(this.builder);
  }
}

class CarSeatsBuilder {
  private builder: CarBuilder;

  constructor(builder: CarBuilder) {
    this.builder = builder;
  }

  setSeats(seats: number): CarBuilder {
    this.builder.seats = seats;
    return this.builder;
  }
}

const car = new CarBuilder().setWheels(4).setEngine('v8').setSeats(4).build();
console.log(car);

class Person3 {
  name = 'Mark';

  get(this: Person) {
    // 타입스크립트에서 0번쨰 this는 해당 메서드를 호출한 객체를 가리킨다(명시적 선언).
    // 즉, 타입체킹목적이기에 자바스크립트로 컴파일되면 사라진다
    return this;
  }
}

export {};
