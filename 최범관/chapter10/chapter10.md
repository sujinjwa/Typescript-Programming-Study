# Chapter10 - Namespaces.Modules

함수, 클래스, 객체와 같은 형태로 캡슐화를 표현할 수 있습니다.
보통은 한 파일에 한 개의 클래스나 유틸리티 집합을 담는데, 이런 클래스나 유틸리티가 많아지면 패키지로 묶어서 NPM에 업로드 할수도 있습니다.

## 자바스크립트 모듈의 역사

1995년 자바스크립트 출범시 모듈 시스템을 전혀 지원하지 않아 전역 네임스페이스에 정의했고,이런 방식으로는 같은 변수명으로 충돌이 일어났기 때문에 응용 프로그램을 만들고 확장하기 어려웠습니다.<br>
이 문제를 해결하고자 객체를 이용하거나 즉시 실행 함수를 전역 window에 할당해 모듈 시스템을 흉내냈습니다.

```js
window.emailListModule = {
  renderList() {},
  // ...
};

window.emailComposerModule = {
  renderComposer() {},
  // ...
};

window.appmodule = {
  renderApp() {
    window.emailListModule.renderList();
    window.emailComposerModule.renderComposer();
  },
};
```

자바스크립트를 로딩하고 실행하는 동안 브라우저는 UI는 블록되어 웹 응용 프로그램이 커지고 코드가 늘어날수록 사용자의 브라우저는 점점 느려졌습니다. 이런 문제를 해결하고자 페이지를 로드하고 필요한 파일만 동적으로 로드하는 방식으로 개발하기 시작했습니다.

자바스크립트가 출시되고 10년이 지난 시점에서 Dojo(2004), YUI(2005), LABjs(2009) 등이 자바스크립트를 비동기로 lazy load하는 모듈 로더를 제공했습니다.

비동기로 lazy loading을 한다는 것은 다음과 같은 세 가지 의미를 가집니다.

1. 모듈을 잘 캡슐화되어야 한다. 그렇지 않으면 의존성을 확보하는 과정에서 페이지가 망가질 수 있다.

2. 모듈 간의 의존성은 명시적이어야 한다. 그렇지 않으면 한 모듈에 어떤 모듈이 필요하며 어떤 순서로 로딩해야 하는지 알 수 없기 때문이다.

3. 모든 모듈은 앱 내에서 고유 식별자를 가져야 한다. 그렇지 않으면 어떤 모듈을 로딩해야 하는지 안정적으로 지정할 수 없다.

다음은 LABjs로 모듈을 로드하는 예시입니다.

```ts
$LAB
  .script('/emailBaseModule.js')
  .wait()
  .script('/emailList')
  .script('/emailComposerModule.js');
```

비슷한 시기에 NodeJS(2009)가 출범했으며 NodeJS 개발자들은 자바스크립트의 확장성 문제, 다른 언어에서 영감을 받아 모듈 시스템을 플랫폼 자체에 추가하기로 결정했습니다.

```js
var emailList = require('emailListModule');
var emailComposer = require('emailComposerModule');

module.exports.renderBase = function () {
  // ...
};
```

한편 웹에서는 Dojo와 RequiredJS가 추진하는 AMD 모듈 표준(2008)이 인기를 얻고 있었습니다.

```js
define('emailBaseModule', [
  'require',
  'exports',
  'emailListModule',
  'emailComposerModule',
], function (require, exports, emailListModule, emailComposerModule) {
  exports.renderBase = function () {
    // ...
  };
});
```

몇 년이 지난 후 Browserify(2001)가 출시되면서 프론트엔드 엔지니어도 CommonJS를 사용할 수 있게 되었고, import, export 문법의 표준으로 자리 잡았습니다.

하지만 CommonJS에는 문제가 있었는데,require 호출은 반드시 동기 방식이어야 한다던지, 모듈 해석 알고리즘이 웹에 적합하지 않은 점 등이 있었고 이를 사용하는 코드는 상황에 따라 정적 분석이 불가능 했습니다.

이런 문제를 ECMAScript 언어의 여섯 번째 개정판인 ES2015에 이르러서 새로운 표준이 소개되면서 해결되었습니다.

## import, export

### 동적 임포트

응용 프로그램이 비대해지면서 초기 로딩 시간이 길어집니다. 이 문제는 네트워크 병목이 생기기 쉬운 프론트엔드에서 많이 발생하는데 이를 해결하기 위해 코드를 많은 파일에 분할함으로 여러 파일을 병렬로 로딩할 수 있어 수월하게 로딩을 처리할 수 있습니다.

웹 서비스에 접속하기 위해 사용자는 많은 용량의 자바스크립트 코드를 로드해야 하는데 불필요한 로드를 줄이기 위해 lazy loading을 사용할 수 있습니다.

```ts
const locale = await import('locale/locale-us');
```

### CommonJS와 AMD 코드 사용하기

CommonJS나 AMD 표준을 사용하는 자바스크립트 모듈을 이용할 때는 ES2015 모듈을 사용할 때처럼 단순히 이름으로 불러올 수 있습니다.

```ts
import { somthing } from 'a/b/c/d';
```

기본적으로 CommonJS default export는 ES2015 디폴트 임포트와 궁합이 맞지 않으므로 와일드카드 임포트를 사용해야 합니다.

```ts
import * as fs from 'fs';
fs.readFile('some/file.txt');
```

tsconfig.json의 compilerOptions에서 {"esModuleInterop": true}로 설정하면 와일드카드 없이 더 자연스럽게 연동할 수 있습니다.

```ts
import fs from 'fs';
fs.readFile('some/file.txt');
```

### 모듈 모드 vs 스크립트 모드

타입스크립트는 파일을 모듈 모드 또는 스크립트 모드 중 하나로 파싱합니다. 파일이 import나 export를 포함하느냐를 기준으로 모드를 결정하고 포함되면 모듈, 그렇지 않으면 스크립트 모드로 동작합니다.

모듈 모드는 import와 export를 명시해주어야 하고 스크립트 모드는 최상위 수준으로 선언한 모든 변수는 명시적으로 불러오지 않아도 같은 프로젝트의 다른 파일들에서 사용할 수 있습니다.

### 네임스페이스

타입스크립트는 코드를 캡슐화할 수 있는 namespace 키워드를 제공합니다. 네임스페이스는 파일 시스템에서 파일이 어떻게 구성되었는지 같은 세부사항을 추상화합니다. 모듈을 나누는데 사용될 수 있지만, 대체로 권장되지 않습니다. 모듈 시스템을 사용하는 것이 좋습니다.

네임스페이스는 다른 네임스페이스를 내보낼 수 있기 때문에 중첩된 구조로 작성할 수 있습니다.

```ts
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
```

타입스크립트는 같은 이름을 가지는 네임스페이스를 자동으로 병합합니다.

```ts
export namespace SameName {
  export function method1() {}
}

export namespace SameName {
  export function method2() {}
}
```

네임스페이스 계층이 너무 길어졌다면 짧은 별칭을 지어줄 수 있습니다. 구조 분해 할당을 지원하지 않고 ES2015 모듈을 import 했을 때만 가능합니다.

```ts
namespace A {
  export namespace B {
    export namespace C {
      export const d = 3;
    }
  }
}
```

```ts
import d = A.B.C.d;
```

### 충돌

같은 이름을 내보내기하면 충돌이 생깁니다.

```ts
namespace Network {
  export function request() {}
}

namespace Network {
  export function request() {}
}
```

### 컴파일된 출력

import export와 달리 네임스페이스는 tsconfig.json의 모듈 설정에 영향을 받지 않으며 항상 전역 변수로 컴파일 됩니다.

```ts
namespace Flowers {
  export function give(count: number) {
    return count + 'flowers';
  }
}
```

## 선언 합치기

타입스크립트는 인터페이스와 네임스페이스를 자동으로 병합해주고, 컴패니언 객체 패턴을 활용하면 타입과 값이 같은 이름으로 선언되어 있으면 같은 이름으로 값 혹은 타입을 가르킬 수 있습니다. 이는 타입스크립트가 제공하는 동작의 특수한 사례들입니다.
