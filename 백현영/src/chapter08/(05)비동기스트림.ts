// ------------- 비동기 스트림 -------------
// 지금까지 promise를 이용해 미래의 값을 설계하고, 연결하고, 조합함
// 그렇다면 미래의 서로 다른 시점에 이용할 값이 여러개일때는 ?
// (eg. 폼을 작성할때 여러키 입력, 선거시 부재자 투표가 이뤄질때, 비디오 스트림 픽셀받기)
// 이들 모두 여러 데이터로 이루어져있고 각각의 데이터를 미래의 한 시점에 받게된다.

// ------------- 이벤트 방출기 -------------
// RxJs의 observable을 이용해도 된다
// nodeJs의 event Emitter를 이용해보자

interface emitter {
  // 방출
  emit(channel: string, value: unknown): void;

  // 방출되었을때 인식하고 작업을 수행 (observer의 리스너)
  on(channel: string, fn: (value: unknown) => void): void;
}
// valude 의 타입이 특정 channel에 의존하기에 대부분의 언어에서는 타입으로 표현할 수 없기에 안전하지않다
// 단, 타입스크립트는 가능하다 (오버로드된 함수 시그니처 + 리터럴타입)
// 이벤트를 방출하고 각 채널에 리스닝하는 메서드를 생성하는 매크로로 해결 가능

import { createClient } from 'redis';

const client = createClient();

client.on('ready', () => console.info('client ready'));
client.on('error', (e) => console.error(e.message));
client.on('reconnecting', (params) => console.info('Reconnectiong...', params));

// Redis 라이브러리 사용법이므로 코드에 대해 알 필요는 없다.
// 다만 궁금해지지 않는가 ? 각 이벤트에 대한 리터럴을 어떤 타입으로 표현했을까 ?

// 예상 1) 오버로드된 타입이 가장 안전하고 간단할것 같다
type RedisClient = {
  on(event: 'ready', fn: () => void): void;
  on(event: 'error', fn: (e: Error) => void): void;
  on(
    event: 'reconnecting',
    fn: (params: { attempt: number; delay: number }) => void
  ): void;
};
// 우아하지 못하다.
interface EventMap {
  ready: void;
  error: Error;
  reconnecting: { attempt: number; delay: number };
}

type RedisClientBetter = {
  emit<T extends keyof EventMap>(event: T, arg: EventMap[T]): void;
  on<T extends keyof EventMap>(event: T, f: (arg: EventMap[T]) => void): void;
};

// ----------------- summary -----------------
// 위와 같이 매핑된 타입을 사용하는 익숙한 곳이 있다 -> DOM 이벤트
