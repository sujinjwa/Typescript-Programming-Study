// ---factory pattern---
// : 어떤 객체를 만들지 팩토리에게 위임

interface Shoe {
  purpose: string;
}

export class BalletFlat implements Shoe {
  purpose = 'dancing';
}

export class Boot implements Shoe {
  purpose = 'woodcutting';
}

export class Sneaker implements Shoe {
  purpose = 'walking';
}

// 타입과 값이 같은 이름을 갖게했다 -> 컴패니언 객체 패턴이란 것인데 하나의 네임스페이스로 값과 타입을 관리할 수 있다.
// import 해올때 하나의 이름으로 가져온다는게 가장 큰 이점같다.
let Shoe = {
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

// ---builder pattern---
// 말그대로 빌드하는 패턴이다.
// 순차적으로 쌓아간다고 생각하면 될거같다

class RequestBuilder {
  private data: object | null = null;
  private method: 'get' | 'post' | null = null;
  private url: string | null = null;

  setMethod(method: 'get' | 'post'): this {
    this.method = method;
    return this;
  }

  setData(data: object): this {
    this.data = data;
    return this;
  }

  setUrl(url: string): this {
    this.url = url;
    return this;
  }

  send() {
    // ...
  }
}

new RequestBuilder()
  .setUrl('lacalhost:3000/users') // 하나씪
  .setMethod('get') // 쌓자
  .setData({ firstName: '이렇게' }) // 으쌰
  .send();

export {};
