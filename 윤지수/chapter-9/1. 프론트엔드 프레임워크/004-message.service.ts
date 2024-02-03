import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

// 앵귤러에서 서비스를 만들 때는 타입스크립트의 데코레이터를 이용하여 그 서비스를 Injectable로 등록하고, 응용 프로그램의 루트 수준으로 제공할지 서브모듈에만 제공할지 정의한다.
// MessageService 서비스는 응용 프로그램의 어디에서나 주입할 수 있다(루트 수준으로 제공). 따라서 모든 컴포넌트와 서비스 생성자에서 MessageService를 요청할 수 있으며, 그러면 앵귤러가 알아서 메시지를 전달해준다.
@Injectable({ providedIn: root })
export class MessageService {
  constructor(private http: HttpClient) {}
  getMessage() {
    return this.http.get("api/message");
  }
}
