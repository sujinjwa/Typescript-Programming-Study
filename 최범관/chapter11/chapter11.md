# Chapter11 - 자바스크립트와 상호 동작

## 타입 선언

d.ts 확장자를 가진 파일은 타입 선언입니다.
타입 선언이란 타입이 없는 자바스크립트 코드에 타입스크립트 타입을 부여할 수 있는 수단입니다.

타입 선언은 일반 타입스크립트 문법과 비슷하지만 몇 가지 차이가 있습니다.

1. 타입만 포함할 수 있다.
2. 값을 정의할 수 없다.
3. 값을 정의할 수는 없지만 declare라는 키워드를 사용해 자바스크립트의 어딘가에 값이 존재한다는 사실을 알려줄 수 있다.
4. 사용자가 볼 수 있는 대상에만 타입을 선언할 수 있다. 노출되지 않은 타입이나 함수 안에 선언된 지역 변수의 타입은 포함할 수 없다.

declarations 플래그를 활성화한 다음 TSC로 컴파일하면(tsc -d) 타입 정의가 생성됩니다.

타입스크립트로 개발된 어떤 라이브러리를 NPM에 올리고자 했을 때 업로더는 두 가지의 선택지를 가질 수 있습니다.

1. 타입스크립트 파일과 컴파일된 자바스크립트 파일 업로드

2. 자바스크립트 파일과 타입스크립트 타입 선언 파일 업로드
   두 번째 방법을 이용하면 파일 크기를 줄일 수 있고 무엇을 임포트해야 하는지 더 명확해진다.
   또 타입 선언의 경우 컴파일하지 않아도 되므로 컴파일 시간을 줄일 수 있다.

타입 선언 파일은 다음과 같이 활용됩니다.

1. 다른 사용자가 타입스크립트 응용 프로그램에서 여러분이 만든 컴파일한 타입스크립트를 사용한다면
   그들의 인스턴스는 여러분의 타입스크립트로부터 생성된 자바스크립트 파일에 대응하는 d.ts 파일을 검색한다.
   타입스크립트가 여러분의 프로젝트에 사용된 타입을 알 수 있다.

2. 타입스크립트를 지원하는 코드 편집기는 이 d.ts 파일들을 읽어 해석한 다음 여러분이 코드를 작성할 때 유용한 타입 힌트를 제공한다.

3. 타입스크립트 코드의 불필요한 재컴파일을 막아주어 컴파일 시간을 크게 줄여줍니다.

타입 선언 파일에 선언된 최상위 수준 값에는 declare 키워드를 사용해야 하지만 최상위 수준 타입과 인터페이스에는 사용하지 않아도 됩니다.

## 앰비언트 변수 선언

앰비언트 변수 선언은 한 프로젝트의 모든 ts와 d.ts 파일에서 임포트 하지 않고 사용할 수 있는 전역 변수의 존재를 타입스크립트에 알리는 수단입니다.

declare 키워드를 통해 선언할 수 있습니다.

```ts
declare let age: number;
```

## 앰비언트 타입 선언

앰비언트 타입 선언은 앰비언트 변수 선언과 같은 규칙을 사용합니다. 즉 선언은 스크립트 모드 파일의 ts나 d.ts 파일에 저장해야 하며 명시적으로 임포트 하지 않아도 프로젝트의 모든 파일에서 전역으로 이용할 수 있습니다.

## 앰비언트 모듈 선언

자바스크립트 모듈을 사용하면서 그 모듈에서 사용할 일부 타입을 빠르게 선언하고 안전하게 사용하고 싶다면 앰비언트 모듈 선언을 사용할 수 있습니다.

앰비언트 모듈 선언은 평범한 타입 선언을 declare module이라는 특별한 문법으로 감싸는 것이 특징입니다.

```ts
declare module 'module-name' {
  export type MyType = number;
  export type MyDefaultType = { a: string };
  export let myExport: MyType;
  let myDefaultExport: MyDefaultType;
  export default myDefaultExport;
}

import ModuleName from 'module-name';

ModuleName.a; // string
```

중첩된 디렉토리 경로에 모듈이 존재한다면 import 할 때 전체 경로를 포함해야 합니다.

```ts
decalre module '@most/core' {
  // 타입 선언
}
```

실제 선언은 생략하고 헤더만 유지하면 모듈의 타입을 any로 사용할 수 있습니다.

```ts
// import 했을 때 any 타입이 되도록 선언
declare module 'unsafe-module-name';
```

```ts
import { x } from 'unsafe-module-name';
x; // any
```

하지만 이 상태로 모듈을 사용하게 되면 안전성이 떨어집니다.

모듈 선언은 와일드카드(\*) import를 지원하므로 주어진 패턴과 일치하는 모든 import 경로를 특정한 타입으로 해석할 수 있도록 할 수 있습니다.

```ts
// 웹팩의 json 로더로 import한 JSON 파일의 타입 선언
declare module 'json!*' {
  let value: object;
  export default value;
}

declare module '*.css' {
  let css: CSSRuleList;
  export default css;
}
```

```ts
import a from 'json!myFIle';
a; // object

import b from './widget.css';
b; // CSSRuleList
```

## 자바스크립트를 타입스크립트로 마이그레이션 하기

1. TSC를 프로젝트에 추가한다.

2. 기존 자바스크립트 코드에 타입 확인을 시작한다.

3. 한 번에 한 파일씩 자바스크립트를 타입스크립트로 마이그레이션한다.

4. 의존하는 외부 코드용 타입 선언을 설치한다.
   두 가지 방법이 있는데, 아직 타입이 없는 외부 코드용 타입의 스텁(stub)을 만들거나, 타입 선언을 만들어서 DefinitelyTyped에 기여하면 된다.

> DefinitelyTyped<br>
> 자바스크립트 타입 선언 전용 오픈 소스 저장소

5. 코드베이스에 strict 모드를 적용한다.

시간이 오래 걸리지만, 결과적으로 안전성과 생산성 두 마리 토끼를 잡을 수 있다.

### 1. TSC 추가

타입스크립트와 자바스크립트가 함께 사용된 코드베이스에서는 TSC가 자바스크립트 파일까지 컴파일하도록 설정합니다.

tsconfig.json

```json
{
  "compilerOptions": {
    "allowJs": true
  }
}
```

### 2-1. 자바스크립트에 타입 확인 활성화(optional)

tsconfig.json에 checkJs 옵션을 활성화하면 컴파일러는 타입스크립트를 컴파일하듯 자바스크립트를 다룹니다.

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true
  }
}
```

파일별로 해당 옵션을 주석을 통해 끄고 킬 수 있습니다.

```js
// @ts-check
// @ts-nocheck
```

타입스크립트가 모든 것을 추론하지는 못하기 때문에(함수 매개변수 타입 등) any로 추론되는 대상이 많을 수 밖에 없습니다. 그런 경우 마이그레이션이 끝날 때까지만 일시적으로 암묵적 any를 허용할 수 있습니다.

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "noImplictAny": false
  }
}
```

타입스크립트로 자바스크립트의 타입을 검사하면 타입스크립트 코드를 실행할 때보다 다음과 같이 더 관대하게 추론 알고리즘이 적용됩니다.

- 모든 함수 매개변수는 optional이다.

- 함수와 클래스의 프로퍼티 타입은 어떻게 선언했는지가 아니라 어떻게 사용했는지에 의해 결정된다.

```js
class A {
  x = 0; // number | string | string[]
  method() {
    this.x = 'foo';
  }
  otherMethod() {
    this.x = ['array', 'of', 'strings'];
  }
}
```

- 객체, 클래스 함수를 선언한 후 추가 프로퍼티를 할당할 수 있습니다. 타입스크립트는 각 클래스와 함수 선언에 대응하는 네임스페이스를 생성하고 모든 객체 리터럴에 인덱스 시그니처를 자동 추가해 이를 구현합니다.

### 2-2. JSDoc 어노테이션 추가(optional)

급한 상황에서는 기존 자바스크립트 파일은 제외하고 새로운 함수만 타입 어노테이션을 추가하고 싶을 수도 있습니다.

그런 경우 JSDoc을 통해 어노테이션을 추가할 수 있습니다.

```js
/**
 * @param {string} word 변환할 입력 문자열
 * @returns {string} 파스칼 표기법(pascal case)로 변환된 문자열
 */
export function toPascalCase(word) {
  return word.replace(
    /\w+/g,
    ([a, ...b]) => a.toUpperCase() + b.join('').toLowerCase()
  );
}

toPascalCase('abc');
```

### 3. 확장자를 ts로 변경

확장자를 ts로 변경하면 오류들이 쏟아져 나오는데, 이 오류를 해결하는 전략은 두 가지가 있다.

1. tsconfig.json에서 noImplictAny 옵션을 켜 any로 평가된 타입들에 올바른 타입들을 찾아주고, 작업을 마무리 했다면 비활성화 해 그 외 에러를 처리하는 방법

2. tsconfig.json에서 strict를 false로 설정하고 타입 에러가 적게 발생하도록 설정한 후 에러를 고친다. 이후 strict 모드 플래그(noImplictAny, noImplictThis, strictNullChecks 등)를 한 개씩 켜면서 발생하는 에러를 고치는 방법

두 방법 모두 장단점이 존재하므로 어떤 방법을 택할지는 본인에게 달려있습니다.

### 4. 엄격하게 만들기

자바스크립트의 주요 부분을 타입스크립트로 바꿨으면 TSC의 엄격성과 관련된 플래그를 한 개씩 설정해가면서 코드를 안전하게 만들어야 합니다.

마지막에는 자바스크립트와 상호 운용 플래그를 꺼서 모든 코드가 엄격한 타입의 타입스크립트가 되도록 강제합니다.

```json
{
  "compilerOptions": {
    "allowJs": false,
    "checkJs": false
  }
}
```

이렇게 하면 모든 에러가 나타나고, 이 문제들까지 해결하면 코드베이스는 아주 깨끗하고 안전해질 입니다.

## 자바스크립트의 타입 검색

타입스크립트 파일에서 자바스크립트 파일을 불러올 때 타입스크립트는 다음 알고리즘을 토대로 자바스크립트 코드에 필요한 타입 선언을 검색합니다.

1. js 파일과 이름이 같은 d.ts 파일을 찾는다. 이 파일이 존재하면 js의 파일의 타입 선언으로 사용한다.

2. 적절한 타입 선언 파일이 없고 allowJs와 checkJs 옵션이 true라면 js 파일의 타입을 추론한다(JSDoc 어노테이션 이용).

3. 2에 해당하지 않으면 모두 any로 처리한다.

서드 파티 모듈(NPM 패키지)을 사용할 때는 다른 알고리즘을 사용합니다.

1. 모듈의 지역 타입 선언이 존재한다면 그 선언을 사용한다.

2. 지역 타입 선언이 존재하지 않는다면 모듈의 package.json을 확인한다. types나 typings라는 필드가 정의되어 있으면 해당 필드가 가리키는 d.ts 파일을 모듈의 타입 선언 소스로 사용한다.

3. 아니면 한 번에 한 단계씩 상위 디렉토리로 이동하면서 node_modules/@types 디렉토리를 찾는다.

4. 그래도 타입 선언을 찾지 못했다면, 지역 타입 찾기 알고리즘을 수행한다.

## 서드 파티 라이브러리 사용

npm install로 서드 파티 자바스크립트 코드를 프로젝트에 설치할 때 다음과 같은 상황이 일어날 수 있습니다.

1. 코드를 설치할 때 타입 선언이 함께 제공됨

2. 타입 선언이 제공되지 않지만 DefinitelyTyped에서 선언을 구할 수 있음

3. 타입 선언이 제공되지 않고, DefinitelyTyped에서도 선언을 구할 수 없음

### 타입 선언을 포함

{"noImplicitAny": true}를 설정한 상황에서 import 하면 타입 선언이 따라오며 타입스크립트는 에러를 발생시키지 않습니다.

### DefinitelyTyped에서 선언을 제공

서드 파티 코드가 자체적으로 타입 선언을 포함하지 않더라도 타입스크립트 커뮤니티를 관리하는 앰비언트 모듈 선언 중앙 저장소인 DefinitelyTyped에서 타입 선언을 제공하기도 합니다. 설치한 패키지의 타입 선언이 DefinitelyTyped에 있는지 확인하려면 <a href="https://github.com/DefinitelyTyped/DefinitelyTyped">TypeSearch</a>에서 검색해보거나 타입 선언이 설치되는지 확인해볼 수 있습니다.

```
npm install @types/lodash --save-dev
```

### 타입 선언을 제공하지 않음

가장 드문 상황이고 이런 경우 가장 빠르지만 안정성이 떨어지는 `// @ts-ignore` 지시어를 사용할 수 있습니다.

또 다른 방법으로는 빈 타입 선언 파일을 하나 만들어 화이트리스트를 처리할 모듈을 적을 수 있습니다. 새로운 타입 선언을 만들고 앰비언트 타입 선언을 적습니다.

```ts
// types.d.ts
declare module 'nearby-ferret-alerter';
```

이렇게 해서 모듈이 존재함을 알려주지만 어떤 타입을 포함하는지는 알려주지 않습니다. 하지만 타입 시스템을 사용하지 않는 모든 모듈 정보를 한 파일에 둔다는 점에서 첫 번째 방법보다는 낫습니다.

3. 앰비언트 모듈 선언에 직접 구현할 수 있습니다.

```ts
// types.d.ts
declare module 'nearby-ferret-alerter' {
  export default function alert(loudness: 'quiet' | 'loud'): Promise<void>;
  export function getFerretCount(): Promise<void>;
}
```

이제 타입스크립트는 nearby-ferret-alerter 라이브러리로부터 alert 메서드를 가져와 사용하면 타입이 무엇인지 정확히 알 수 있습니다.

4. 타입 선언을 만들고 NPM에 직접 제공할 수 있습니다. 라이브러리에 직접 Pull Request를 요청할 수도 있고 DefinitelyTyped에 제공할 수도 있습니다.
