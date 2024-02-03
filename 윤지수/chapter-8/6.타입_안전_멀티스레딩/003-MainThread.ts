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

let commandEmitter = new SafeEmitter<Commands>();
let eventEmitter = new SafeEmitter<Events>();
let worker = new Worker("003-WorkerScript.js");

// 워커로 들어오는 이벤트를 리스닝하여 타입 안전한 이벤트 방출기로 다시 방출
worker.onmessage = (event) =>
  eventEmitter.emit(event.data.type, ...event.data.data);

// 이 스레드가 발행하는 명령을 리스닝하여 워커로 전송
commandEmitter.on("sendMessageToThread", (data) =>
  worker.postMessage({ type: "sendMessageToThread", data })
);
commandEmitter.on("createThread", (data) =>
  worker.postMessage({ type: "createThread", data })
);
// ...

// 새 스레드가 생성되었음을 워커가 알려주면 작업을 수행
eventEmitter.on("createdThread", (threadID, participants) =>
  console.log("Created a new chat thread!", threadID, participants)
);

// 명령을 워커로 전송
commandEmitter.emit("createThread", [123, 456]);
