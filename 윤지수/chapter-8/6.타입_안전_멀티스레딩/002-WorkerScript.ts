// 모든 가능한 메시지 타입의 유니온을 정의한 다음 switch 문에서 Message 타입을 기준으로 분기하는 방법으로 타입 적용

type Command =
  | { type: "sendMessageToThread"; data: [ThreadID, Message] }
  | { type: "createThread"; data: [Participants] }
  | { type: "addUserToThread"; data: [ThreadID, UserID] }
  | { type: "removeUserFromThread"; data: [ThreadID, UserID] };

onmessage = (e) => processCommandFromMainThread(e.data);

// 메인 스레드에서 들어오는 모든 메시지 처리
// 타입을 지정하지 않은 onmessage API를 타입을 지정해 감싸주는 안전한 래퍼 역할
function processCommandFromMainThread(command: Command) {
  switch (command.type) {
    case "sendMessageToThread":
      let [threadID, message] = command.data;
      console.log(message);
    // ...
  }
}
