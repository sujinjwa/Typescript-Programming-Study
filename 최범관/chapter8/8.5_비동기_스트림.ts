// 서로 다른 시점에 이용할 수 있게 될 값이 여러개라면?
// 넷플릭스 서버로부터 비디오 스트리밍의 픽셀들을 받는 상황
// 폼을 작성하느라 여러 키를 입력하는 상황
// 파일 시스템에서 파일의 일부를 읽는 상황

// 이런 상황을 대처하기 위해서 이벤트 방출기를 이용하거나 리액티브 프로그래밍 라이브러리를 사용할 수 있다.

// 001 이벤트 방출기
// 채널로 이벤트를 방출하고 채널에서 발생하는 이벤트를 리스닝하는 API를 제공한다.
interface Emitter {
  // 이벤트 방출
  emit(channel: string, value: unknown): void;
  // 이벤트가 방출되었을 때 어떤 작업을 수행
  on(channel: string, callback: (value: unknown) => void): void;
}
// 대부분의 언어에서 이런 형태의 이벤트 방출기는 안전하지 않다.
// value의 타입이 특정 채널에 의존하는데, 대부분의 언어에서는 이런 관계를 타입으로 표현할 수 없기 때문이다.
// 하지만 타입스크립트는 타입 시스템을 이용해 자연스럽고 안전하게 표현할 수 있다.

// NodeRedis 클라이언트를 사용하는 예시이다.
type RedisEvents = {
  ready: void;
  error: Error;
  reconnection: { attempt: number; delay: number };
};

type RedisClient = {
  on<E extends keyof RedisEvents>(
    event: E,
    callback: (arg: RedisEvents[E]) => void
  ): void;

  emit<E extends keyof RedisEvents>(event: Element, arg: RedisEvents[E]): void;
};

// 이벤트 이름과 인수를 하나의 형태로 따로 빼내서, 리스너와 방출기를 생성했다.
// 매핑된 타입을 사용하는 패턴은 실무의 타입스크립트 코드에서 자주 볼 수 있고, 간결할 뿐 아니라 안전하다.
// 이런 식으로 타입을 지정하면 휴먼 에러나 타입 에러 또는 인수 전달을 빼먹는 실수를 방지할 수 있다.
// IDE가 리스닝하는 이벤트와 콜백 함수의 매개변수 타입을 제공하기 때문에 문서화 역할도 할 수 있다.
