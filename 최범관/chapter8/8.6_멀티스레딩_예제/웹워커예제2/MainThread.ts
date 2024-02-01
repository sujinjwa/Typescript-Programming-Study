import { EventEmitter } from 'stream';

export type Message = string;
export type ThreadId = number;
export type UserId = number;
export type Participants = UserId[];

export type Commands = {
  sendMessageToThread: [ThreadId, Message];
  createThread: [Participants];
  addUserToThread: [ThreadId, UserId];
  removeUserFromThread: [ThreadId, UserId];
};

export type Events = {
  receivedMessage: [ThreadId, UserId, Message];
  createdThread: [ThreadId, Participants];
  addUserToThread: [ThreadId, UserId];
  removedUserFromThread: [ThreadId, UserId];
};

// 웹 워커의 자잘한 이벤트를 EventEmitter 기반의 API로 추상화
// SafeEmitter를 사용하면 리스닝 계층을 안전하게 구현하는 데 필요한 많은 코드를 줄일 수 있다.
// 또한 워커 쪽에서는 모든 onmessage 호출을 방출기로 위임하여 사용자에게 편리하고 안전하게 리스너 API를 제공할 수 있게 되었다.
export class SafeEmitter<Events extends Record<PropertyKey, unknown[]>> {
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
