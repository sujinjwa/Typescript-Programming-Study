// 미래의 서로 다른 시점에 이용할 수 있게 될 값이 여러 개라면 어떻게 처리?

// 여러 개의 데이터로 이루어지며 각각의 데이터를 미래의 어떤 시점에 받게 되는 경우
// NodeJSdml EventEmiiter 같은 이벤트 방출기 또는 RxJS 같은 리액티브 프로그래밍 라이브러리 이용
// 이벤트는 빠르고 가벼운 반면 리액티브 프로그래밍 라이브러리는 더 강력하며 이벤트 스트림을 조합하고 연결하는 기능을 제공한다.

// 이벤트 방출기 - 채널로 이벤트를 방출하고 채널에서 발생하는 이벤트를 리스닝하는 API를 제공
// 자바스크립트에서 자주 사용하는 디자인 패턴
interface Emitter {
  // 이벤트 방출
  emit(channel: string, value: unknown): void;
  // 이벤트가 방출되었을 때 어떤 작업을 수행
  on(channel: string, f: (value: unknown) => void): void;
}

// 대부분의 언어에서 이런 형태의 이벤트 방출기는 안전하지 않다. value의 타입이 특정 channel에 의존하는데 대부분의 언어에서는 이런 관계를 타입으로 표현할 수 없기 때문이다.
// "이 채널에서는 이런 타입의 이벤트를 방출한다"
// 타입스크립트에서는 타입 시스템을 이용해 자연스럽고 안전하게 표현할 수 있다.

import Redis from "redis";

// 새로운 Redis 클라이언트 인스턴스 생성
let client = Redis.createClient();

// 클라이언트가 방출하는 몇 가지 이벤트 리스닝
client.on("ready", () => console.info("Client is ready"));
client.on("error", (e) => console.error("An error occurred", e));
client.on("reconnecting", (params) => console.info("Reconnecting...", params));

// on API를 사용할 때 콜백 함수의 인수 타입??🤔
// 인수의 타입은 Redis가 방출하는 채널에 따라 달라질 수 있으므로 한 가지 타입으로는 표현할 수 없다.
// 1️⃣ 오버로드된 타입 사용
type RedisClientOverload = {
  on(event: "ready", f: () => void): void;
  on(event: "error", f: (e: Error) => void): void;
  on(
    event: "reconnecting",
    f: (params: { attempt: number; delay: number }) => void
  ): void;
};

// 2️⃣ 매핑된 타입 사용
// 키의 철자가 틀리거나 인수 타입을 잘못 사용하거나 인수 전달을 빼먹는 실수를 방지할 수 있다.

// 방출할 수 있는 모든 이벤트의 타입을 나열하는 객체 타입 정의
type Events = {
  ready: void;
  error: Error;
  reconnecting: { attempt: number; delay: number };
};

// Events 타입을 매핑하면서 여기서 정의한 모든 이벤트에서 on, emit을 호출할 수 있음을 타입스크립트에 알려줌
type RedisClient = {
  // 리스너
  on<E extends keyof Events>(event: E, f: (arg: Events[E]) => void): void;
  // 방출기
  emit<E extends keyof Events>(event: E, arg: Events[E]): void;
};
