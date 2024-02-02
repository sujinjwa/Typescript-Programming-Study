import {
  Commands,
  Events,
  Message,
  Participants,
  SafeEmitter,
  ThreadId,
  UserId,
} from './MainThread';

type Command =
  | { type: 'sendMessageToThread'; data: [ThreadId, Message] }
  | { type: 'createdThread'; data: [Participants] }
  | { type: 'adduserToThread'; data: [ThreadId, UserId] }
  | { type: 'removeUserFromThread'; data: [ThreadId, UserId] };

onmessage = e => {
  processCommandFromMainThread(e.data);
};

// 메인 스레드로부터 받는 커맨드에 따라 어떠한 로직을 처리하는 함수
function processCommandFromMainThread(command: Command) {
  switch (command.type) {
    case 'sendMessageToThread':
    // ...
  }
}

// 이벤트 방출기처럼 웹 워커를 사용할 수 있다.

// 실제 구현
// 메인 스레드로부터 들어오는 이벤트를 리스닝
const commandEmitter = new SafeEmitter<Commands>();

// 들어오는 이벤트를 다시 메인 스레드로 방출
const eventEmitter = new SafeEmitter<Events>();

// 메인 스레드로부터 받은 명령을 안전한 타입을 받는 이벤트 방출기로 전달
onmessage = command => {
  const { type, data } = command.data;
  commandEmitter.emit(type, ...data);
};

// 워커가 발생시킨 이벤트를 리스닝하며 메인 스레드로 전송
eventEmitter.on('receivedMessage', data =>
  postMessage({ type: 'recivedMessage', data })
);
eventEmitter.on('createdThread', data =>
  postMessage({ type: 'createdThread', data })
);

// 메인 스레드가 보낸 명령에 응답
commandEmitter.on('sendMessageToThread', (threadId, message) =>
  console.log(`Ok, I will send a message to threadId ${threadId}`)
);

// 이벤트를 다시 메인 스레드로 방출
eventEmitter.emit('createdThread', 123, [456, 789]);
