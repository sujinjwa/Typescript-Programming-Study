// process.on API - 부모(메인) 스레드가 전송한 메시지 리스닝
process.on("message", (data) =>
  console.info("Parent process sent a message", data)
);

// process.send API - 부모(메인) 스레드로 메시지 전송
process.send({ type: "ack", data: [3] });
