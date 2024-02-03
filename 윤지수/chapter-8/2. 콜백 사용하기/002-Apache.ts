import * as fs from "fs";

fs.readFile("윤지수/chapter-8/2.콜백_사용하기/text.txt", { encoding: "utf8" }, (error, data) => {
  if (error) {
    console.error("error reading!", error);
    return;
  }
  console.info("success reading!", data);
});

fs.appendFile("윤지수/chapter-8/2.콜백_사용하기/text.txt", "New access log entry", (error) => {
  if (error) {
    console.error("error writing!", error);
  }
});

// 먼저 호출한 readFile이 읽어 들인 데이터에 나중에 호출한 appendFile에서 새로 추가한 접근 로그를 들어 있을 수도, 아닐 수도 있다는 사실을 눈치채기는 쉽지 않다.
// 타입이 해줄 수 있는 것은 없다.
