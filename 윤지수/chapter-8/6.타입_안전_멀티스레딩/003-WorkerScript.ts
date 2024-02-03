// SafeEmitter를 이용하면 리스닝 계층을 안전하게 구현하는 데 필요한 많은 코드를 극적으로 줄일 수 있다.
// 워커 쪽에서는 모든 onmessage 호출을 방출기로 위임하여 사용자에게 편리하고 안전한 리스너 API를 제공할 수 있다.

import SafeEmitter from "./003-EventEmitter";

type Commands = {
  sendMessageToThread: [ThreadID, Message];
  createThread: [Participants];
  addUserToThread: [ThreadID, UserID];
  removeUserFromThread: [ThreadID, UserID];
};

type Events = {
  receivedMessage: [ThreadID, UserID, Message];
  createdThread: [ThreadID, Participants];
  addedUserToThread: [ThreadID, UserID];
  removedUserFromThread: [ThreadID, UserID];
};

// 메인 스레드로부터 들어오는 이벤트를 리스닝
let commandEmitter = new SafeEmitter<Commands>();

// 이벤트를 메인 스레드로 다시 방출
let eventEmitter = new SafeEmitter<Events>();

// 메인 스레드로부터 받은 명령을 타입 안전한 이벤트 방출기로 감쌈
onmessage = (command) =>
  commandEmitter.emit(command.data.type, ...command.data.data);

// 워커가 발생시킨 이벤트를 리스닝하면서 이를 메인 스레드로 전송
eventEmitter.on("receivedMessage", (data) =>
  postMessage({ type: "receivedMessage", data })
);
eventEmitter.on("createdThread", (data) =>
  postMessage({ type: "createdThread", data })
);
