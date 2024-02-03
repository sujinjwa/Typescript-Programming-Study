// 안전한 통신
// 현재의 클라이언트와 서버는 100% 타입 안전하지만 언젠가는 HTTP, TCP, 소켓 기반 프로토콜처럼 타입을 사용하지 않는 네트워크 프로토콜로 통신해야 할 수 있을 것이다. 그렇다면 어떻게 해야 그 상황에서도 타입 안전성을 유지할 수 있을까?

// 타입 안전성을 제공하는 프로토콜 직접 개발
type Request =
  | { entity: "user"; data: User }
  | { entity: "location"; data: Location };

// client.ts
async function get<R extends Request>(entity: R["entity"]): Promise<R["data"]> {
  let res = await fetch(`/api/${entity}`);
  let json = await res.json();
  if (!json) {
    throw ReferenceError("Empty response");
  }
  return json;
}
// 그리고 대응하는 post, put 함수를 구현하여 REST API에 응답하도록 하고, 서버가 지원하는 각 엔티티에 타입을 추가한다.
async function post() {}
async function put() {}

// app.ts
async function startApp() {
  let user = await get("user");
}

// 백엔드에서는 각각의 엔티티 타입에 대응하는 핸들러들을 구현한다. 핸들러들은 클라이언트가 요구한 엔티티를 데이터베이스에서 읽어 클라이언트로 전송해주면 된다.
