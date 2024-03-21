// Worker Thread

import { EventEmitter } from 'stream';

// onmessage = (messageEvent) => {
//   console.log(messageEvent);
//   console.log(messageEvent.data);
// };

type Command =
  | { type: 'sendMessageToThread'; data: [ThreadID, Message] }
  | { type: 'createThread'; data: [Participants] }
  | { type: 'addUserToThrad'; data: [ThreadID, UserID] }
  | { type: 'removeUserFromThread'; data: [ThreadID, UserID] };

onmessage = (e) => processCommandFromMainThread(e.data);

// 메인쓰레드로부터 들어오는 command를 안전하게 처리해줄 래퍼 함수
function processCommandFromMainThread(command: Command) {
  switch (command.type) {
    case 'sendMessageToThread':
      const [threadID, message] = command.data;
      console.log(threadID, message);
    /** ... */
  }
}

// WebWorker의 자잘한 API를 EventEmitter로 추상화해보자
class SafeEmitter<
  Events extends Record<Exclude<PropertyKey, number>, unknown[]>
> {
  // PropertyKey : 타입스크립트 내장 키 (자바스크립트 키로 쓸 수 있는게 무엇인지 딱 보인다)
  private emitter = new EventEmitter();

  emit<K extends keyof Events>(channel: K, ...data: Events[K]) {
    if (typeof channel !== 'number') {
      return this.emitter.emit(channel, ...data);
    } else {
      throw new TypeError('wrong type');
    }
  }

  on<K extends keyof Events>(
    channel: K,
    listener: (...data: Events[K]) => void
  ) {
    if (typeof channel !== 'number') {
      this.emitter.on(channel, listener as (...data: any[]) => void);
    } else {
      throw new TypeError('Wrong Type');
    }
  }
}

type Commands = {
  sendMessageToThread: [ThreadID, Message];
  createThread: Participants;
  addUserToThread: [ThreadID, UserID];
  removeUserFromThread: [ThreadID, UserID];
};

export default null;
