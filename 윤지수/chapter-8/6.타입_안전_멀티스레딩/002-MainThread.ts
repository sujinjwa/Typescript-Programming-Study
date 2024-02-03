// 타입 정의

type Message = string;
type ThreadID = number;
type UserID = number;
type Participants = UserID[];

// 메인스레드는 Commands를 워커 스레드로 보내고
type Commands = {
  sendMessageToThread: [ThreadID, Message];
  createThread: [Participants];
  addUserToThread: [ThreadID, UserID];
  removeUserFromThread: [ThreadID, UserID];
};

// 워커 스레드는 메인 스레드로 Events를 돌려보낸다.
type Events = {
  receivedMessage: [ThreadID, UserID, Message];
  createdThread: [ThreadID, Participants];
  addedUserToThread: [ThreadID, UserID];
  removedUserFromThread: [ThreadID, UserID];
};
