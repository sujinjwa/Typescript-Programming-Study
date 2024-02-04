# Chapter9 - 프론트엔드 프레임워크와 백엔드 프레임워크

## 프론트엔드 프레임워크

타입스크립트는 프론트엔드 프레임워크 개발에 아주 적합합니다.
내장 DOM API를 사용하기 위해서 tsconfig.json 파일에 다음 내용을 추가합니다.

```json
{
  "compilerOptions": {
    "lib": ["dom", "es2015"]
  }
}
```

DOM 타입 선언을 활성화했으면 다음처럼 안전하게 DOM과 브라우저 API를 사용할 수 있습니다.

```ts
const model = {
  url: window.location.href,
};

const inputElement = document.createElement('input');
inputElement.classList.add('Input', 'URLInput');
inputElement.addEventListener('change', () => {
  model.url = inputElement.value.toUpperCase();
});

document.body.appendChild(inputElement);
```

### 리액트

리액트의 컴포넌트가 이러한 데이터를 받는다는 것을 타입으로 명시할 수 있습니다.
타입스크립트와 리액트로 뷰의 타입을 지정한다면 생산성은 증가할 것입니다.

#### JSX

JSX를 이용하면 일반 HTML처럼 보이는 코드를 구현할 수 있습니다.

```html
<ul class="list">
  <li>First</li>
  <li>Second</li>
  <li>Last</li>
</ul>
```

다음과 같은 JSX 문법을 바벨의 transform-react-jsx 플러그인 같은 컴파일러로 컴파일하면 다음의 결과가 됩니다.

```ts
React.createElement(
  'ul',
  { class: 'list' },
  React.createElement('li', null, 'First'),
  React.createElement('li', null, 'Second'),
  React.createElement('li', null, 'Last')
);
```

#### TSX

TSX(JSX + TS)를 사용하기 위해 tsconfig.json에 다음 내용을 추가합니다.

```json
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```

tsconfig.json의 jsx 지시어는 세 가지 모드를 지원합니다.

- react<br>
  JSX를 js 파일로 컴파일

- react-navtive<br>
  컴파일하지 않고 JSX를 보존하며 js 파일을 생성

- preserve<br>
  JSX의 타입을 검사하지만 컴파일하지는 않으며 jsx 확장자의 파일을 생성

타입스크립트는 내부적으로 TSX 타입을 넣고 뺄 수 있는 몇 가지 훅을 제공합니다. TSX 타입들은 global.JSX 네임스페이스에 존재하는 특별한 타입으로 이 네임스페이스를 참고해 프로그램에 쓰인 TSX 타입들이 올바른지 판단합니다.

#### 리액트에서 TSX 사용하기

리액트는 함수형 컴포넌트 클래스형 컴포넌트 두 가지 컴포넌트를 선언할 수 있다.
현재 리액트 공식 메뉴얼에서는 함수형 컴포넌트를 사용하도록 권장하고 있다.

```tsx
import React from 'react';

type props = {
  isDisabled?: boolean;
  size: 'Big' | 'Small';
  text: string;
  onClick(): void;
};

export function FancyButton(props: Props) {
  const [toggled, setToggled] = React.useState(false);

  return (
    <button
      className={`size-${props.size}`}
      disabled={props.disabled || false}
      onClick={e => {
        setToggeld(!toggeld);
        props.onClick(e);
      }}
    >
      {props.text}
    </button>
  );
}
```

### 앵귤러

앵귤러는 리액트보다 기능이 풍부한 프론트엔드 프레임워크입니다. 뷰 렌더링뿐 아니라 네트워크 요청 전송/관리, 라우팅, 의존성 주입 등의 기능도 제공합니다. 태생적으로 타입스크립트로 동작하도록 만들어졌습니다. (타입스크립트로 구현된 프레임워크)

#### 세팅

NPM으로 앵귤러 CLI를 전역으로 설치

```
npm install @angular/cli --global
```

앵귤러 CLI로 새 앵귤러 프로젝트를 생성

```
ng new my-angular-app
```

#### 컴포넌트

앵귤러의 컴포넌트는 리액트의 컴포넌트와 비슷하며 컴포넌트의 DOM 구조, 스타일, 컨트롤러를 묘사할 수 있는 수단을 포함합니다.

앵귤러 컴포넌트는 다음과 같이 여러 개의 파일로 구성됩니다.

- 컴포넌트가 렌더링하는 DOM을 묘소하는 템플릿
- CSS 스타일 모음
- 컴포넌트의 비즈니스 로직을 구현하는 컴포넌트 클래스(타입스크립트 클래스)

```ts
import { Component, OnInit } from '@angular/core';

// 데코레이터로 사용자가 어떻게 컴포넌트를 소비해야 하는지 선언했다.
@Component({
  selector: 'simple-message',
  styleUrls: ['./simple-message.component.css'],
  templateUrl: './simple-message.component.html',
})
// 앵귤러에서 생명주기 hook은 타입스크립트 인터페이스로 제공되어 어느 것을 구현할지만 선언하면 된다.
export class SimpleMessageComponent implements OnInit {
  message: string;
  ngOnInit() {
    this.message = 'No messages, yet';
  }
}
```

#### 서비스

앵귤러는 의존성 주입 기능을 기본으로 제공합니다.
의존성 주입이란 구현체에 직접 의존하지 않고 추상화 된 레이어를 두는 원칙입니다.

아래는 간단한 의존성 주입의 예시입니다.

```ts
function
```

```ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'simple-message',
  styleUrls: ['./simple-message.component.css'],
  templateUrl: './simple-message.component.html',
})
export class SimpleMessageComponent implements OnInit {
  message: string;

  // 외부에서 messageService라는
  constructor(private messageService: MessageService) {}
  ngOnInit() {
    this.messageService
      .getMessage()
      .subscribe(response => (this.message = response));
  }
}
```

앵귤러의 <a href="https://www.angular.kr/guide/aot-compiler">AOT 컴파일러</a>는 컴포넌트의 생성자가 받는 매개변수를 살펴 타입을 알아내고, 관련 의존성 주입기의 의존성 지도(미리 생성자에 선언해둔)를 검색하여 해당 타입의 의존성을 찾습니다. 그리고 해당 의존성이 인스턴스화 되지 않았으면 인스턴스화 하고, 생성자로 전달합니다.

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private http: HttpClient) {}
  getMessage() {
    return this.http.get('api/message');
  }
}
```

앵귤러에서 서비스를 만들 때는 데코레이터를 이용해 Injectbale로 등록하고 프로그램의 루트 수준으로 제공할지 서브모듈에만 제공할지 정의합니다.

## 타입 안전 API

어떤 프레임워크를 사용하던지 클라이언트와 서버, 서버 간 그리고 클라이언트 간의 통신이 안전하게 이루어지기를 바랄 것입니다. 안전한 통신을 위해 몇 가지 도구와 표준이 경쟁하고 있는 중입니다.

안전한 통신을 위한 도구를 알아보기 이전에 직접 안전하게 통신할 수 있는 프레임워크를 구현할 수 있을지 그리고 직접 구현한다면 어떤 문제가 있는지 알아보자.

```ts
type Request =
  | { entity: 'user'; data: User }
  | { entity: 'location'; data: Location };

// client.ts
async function get<R extends Request>(entity: R['entity']): Promise<R['data']> {
  const res = await fetch(`api/${entity}`);
  const json = await res.json();

  if (!json) {
    throw ReferenceError('empty response');
  }

  return json;
}

// app.ts
async function startApp() {
  const user = await get('user');
}
```

서버의 코드가 타입스크립트로 구현되지 않았거나 Request 타입을 서로 공유할 수 없고, REST를 사용하지 않는다면?

이럴 때 타입을 지원하는 코드 생성 API가 필요합니다.
아래는 그 예시입니다.

- RESTful API용(Swagger)
- RagphQL 아폴로(Apollo)와 릴레이(Relay)
- RPC용 gRPC와 아파치 스프리트(Apache Thrift)

위 도구들은 서버와 클라이언트가 동일한 프로토콜을 사용하도록 하고 이를 통해 서버와 클라이언트의 동기화가 깨지는 문제를 피할 수 있습니다.
