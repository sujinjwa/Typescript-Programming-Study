// 웹 워커의 자잘한 API를 익숙한 EventEmitter 기반의 API로 추상화
// 수신하거나 발송하는 메시지 타입의 다양성을 줄일 수 있다.

import EventEmitter from "events";

// 타입 안전 래퍼 생성
class SafeEmitter<Events extends Record<PropertyKey, unknown[]>> {
  private emitter = new EventEmitter();

  emit<K extends keyof Events>(channel: K, ...data: Events[K]) {
    return this.emitter.emit(channel, ...data);
  }

  on<K extends keyof Events>(
    channel: K,
    listener: (...data: Events[K]) => void
  ) {
    return this.emitter.on(channel, listener);
  }
}

export default SafeEmitter;
