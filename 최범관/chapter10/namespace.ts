namespace Network {
  export namespace HTTP {
    export function get<T>(url: string): Promise<T> {
      return new Promise((res, rej) => {});
    }
  }

  export namespace TCP {
    export function listenOn(port: number): void {
      // ...
    }
    // ...
  }

  export namespace UDP {
    // ...
  }

  export namespace IP {
    // ...
  }
}

// 타입스크립트는 같은 이름을 가지는 네임스페이스를 자동으로 병합합니다.
export namespace SameName {
  export function method1() {}
}

export namespace SameName {
  export function method2() {}
}

// 같은 이름을 내보내기하면 충돌이 생깁니다.
namespace Network {
  export function request() {}
}

namespace Network {
  export function request() {}
}

// 네임스페이스보다 모듈을 사용하자
namespace Flowers {
  export function give(count: number) {
    return count + 'flowers';
  }
}
