// 앵귤러는 태생적으로 타입스크립트로 동작하도록 만들어졌다(타입스크립트로 구현된 프레임워크다).
// 앵귤러 명령행 유틸리티인 앵귤러 CLI의 일부로 제공되는 선행(Ahead-of-Time, AoT) 컴파일러는 앵귤러의 핵심으로, 타입스크립트 어노테이션으로 제공한 타입 정보를 이용해 코드를 일반 자바스크립트로 컴파일한다. 앵귤러는 타입스크립트를 직접 호출하지 않고 전반적인 최적화 및 변형을 가한 다음 이를 궁극적으로 타입스크립트에 위임해 자바스크립트로 컴파일한다.

// 앵귤러 응용 프로그램
import { Component, OnInit } from "@angular/core";
import { MessageService } from "./004-message.service";

// 앵귤러 컴포넌트는 컴포넌트의 DOM 구조, 스타일, 컨트롤러를 묘사할 수 있는 수단을 포함한다.
// - 컴포넌트가 렌더링하는 DOM을 묘사하는 템플릿
// - CSS 스타일 모음
// - 컴포넌트의 비즈니스 로직을 구현하는 컴포넌트 클래스

@Component({
  // 앵귤러는 앵귤러 컴포넌트, 서비스, 모듈과 관련한 메타데이터를 선언하기 위해 타입스크립트 데코레이터를 많이 활용한다.
  selector: "simple-message",
  styleUrls: ["./simple-message.component.css"],
  templateUrl: "./simple-message.component.html",
})
export class SimpleMessageComponent implements OnInit {
  message: string;
  // MessageService를 의존성 형태로 주입받음
  constructor(private messageService: MessageService) {}
  // 앵귤러의 생명주기 훅은 타입스크립트 인터페이스로 제공되므로 어느 것을 구현할지만 선언하면 된다(ngOnChanges, ngOnInit 등).
  // 그러면 타입스크립트는 선택한 생명주기 훅에 요구되는 메서드를 구현했는지 확인한다.
  ngOnInit() {
    this.messageService
      .getMessage()
      .subscribe((response) => (this.message = response.message));
  }
}

// 앵귤러는 의존성 주입 기능을 기본으로 제공한다.
// 의존성 주입 - 프레임워크가 서비스를 인스턴스화하고 이 서비스를 필요로 하는 컴포넌트와 서비스에 인수로 제공하는 기능, 서비스와 컴포넌트를 인스턴스화하고 테스트하기가 쉬워진다.

// 앵귤러의 AoT 컴파일러는 컴포넌트의 constructor가 받는 매개변수를 살펴 타입을 알아낸 다음(MessageService), 관련 의존성 주입기의 의존성 지도를 검색하여 해당 타입의 의존성을 찾는다.
// 그리고 해당 의존성이 인스턴스화되지 않았으면 인스턴스화(new)하고, SimpleMessageComponent 인스턴스의 생성자로 전달한다.
