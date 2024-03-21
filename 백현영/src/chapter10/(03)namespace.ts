// --------------- name Space ---------------
// namespace 키워드로 사용
// 네임 스페이스 내부는 export 하지 않는 이상 외부에서 접근 불가능

// module로 export하는것과 뭐가 다른데 ?
// 너무 커져서 module로 쪼갰지만 module이 또 커질수도 있어

namespace ErrorHandling {
  class InvalidDateFormatError extends RangeError {
    constructor(message: string) {
      super(message);
      this.name = this.constructor.name;
    }
  }

  class DateIsInTheFutureError extends RangeError {
    constructor(message: string) {
      super(message);
      this.name = this.constructor.name;
    }
  }
}

namespace ErrorHandling {
  class OtherInvalidDateFormatError extends RangeError {
    constructor(message: string) {
      super(message);
      this.name = this.constructor.name;
    }
  }

  class OtherDateIsInTheFutureError extends RangeError {
    constructor(message: string) {
      super(message);
      this.name = this.constructor.name;
    }
  }
}

// 재귀적으로 병합해줌

// 👍 이름 충돌 방지해줌
// export namespace ErrorHandling {
//   class InvalidDateFormatError extends RangeError {
//     constructor(message: string) {
//       super(message);
//       this.name = this.constructor.name;
//     }
//   }

// ❌ 단, 함수 정제를 위한 오버로드된 앰비언트 함수 선언은 이름 충돌 방지 X
// example

// 네임스페이스는 항상 전역 변수로 컴파일
namespace API {
  export function getAPI() {
    console.log('getAPI');
  }
}

// TSC 컴파일 결과
let url;
(function (url) {
  function getAPI() {
    console.log('getAPI');
  }
  url.getAPI = getAPI;
})(url || (url = {}));

// summary
// 가능하면 namespace보다는 module을 사용하자
