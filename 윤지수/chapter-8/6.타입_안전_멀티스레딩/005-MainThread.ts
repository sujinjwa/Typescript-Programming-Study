// NodeJs 자식프로세스

// NodeJS에 병렬 실행의 타입 안전성을 보장하는 원리는 브라우저에서 웹 워커 스레드가 동작하는 원리와 같다.
// 메시지 전달 계층 자체는 안전하지 않더라도 그 위를 타입 안전 API로 덮는 일은 어렵지 않다.

import { fork } from "child_process";

// fork API - 새 자식 프로세스 생성
let child = fork("./005-ChildThread.js");

// on API - 자식 프로세스에서 들어오는 메시지 리스닝
child.on("message", (data) =>
  console.info("Child process sent a message", data)
);

// send API - 메시지를 자식 프로세스로 전송
child.send({ type: "syn", data: [3] });
