// ------------------- multi threading -------------------
// 싱글쓰레드 언어인 자바스크립트에서 병렬적으로 실행해야하는 경우가 있다.
// 이 경우 타입스크립트를 이용해 안전하게 구현하는 패턴 몇가지를 살펴보자

// using Web Worker
// JS 메인쓰레드가 블로킹되어 UI가 반응하지 않는 사태를 막기위해 워커 쓰레드를 만들기도 한다
// (단, 약간의 제한을 준수해야한다.) (eg. 네트워크 전송, 파일시스템 데이터 기록)
// 다만, 브라우저 코드는 특히 안전(크래쉬, 사용자 경험 악화 방지)해야하기에 웹워커가 메인스레드나 다른 웹워커와 통신하는 주된 수단은 message passing이다.

// 메세지 패싱은 다음과 같이 작동한다.

// MainThread.ts
const worker = new Worker('WorkerScript.js');
worker.postMessage('some data');

// 메인쓰레드는 command를 워커쓰레드로 보낸낸다
// 워커쓰레드는 해당하는 Events를 return

// 계획 : 클라이언트용 메세지 계층
// 1. 들어오는 메세지의 타입 정의
// 2. 에러처리와 권한은 신경쓰지 않고 받기만 할것 -> 워커쓰레드에 위임

// 들어오는 메세지, 보낼 메세지 타입 정의하자
type Message = string;
type ThreadID = number;
type UserID = number;
type Participants = UserID[];

interface Commands {
  receviedMessage: [ThreadID, Message];
  createThread: Participants;
  addUserToThread: [ThreadID, UserID];
  removeUserFromThread: [ThreadID, UserID];
}

// --------------------- 타입 안전 프로토콜 ---------------------
// 특정 명령이 한가지 이벤트만 받도록
// 함수자체를 다른 쓰레드에 넘기기는 어렵다.
// 워커쓰레드 : 함수정의 return result
// 메인쓰레드 : 워커쓰레드로 인수 전달 and 결과 돌려받기

type Matrix = number[][];

type MatrixProtocol = {
  // 계수찾기
  determinant: {
    // 행렬식
    in: [Matrix];
    out: number;
  };
  // 듀 행렬의 내적 계산
  'dot-product': {
    in: [Matrix, Matrix];
    out: Matrix;
  };
  // 역행렬 구하기
  invert: {
    in: [Matrix];
    out: Matrix;
  };
};

// 모든 계산은 워커쓰레드에 위임한다.
// (단, 계산은 안전하지 않게 동작(타입이 정의되지 않은 메세지 이기때문)하기 때문에 타입이 명시된 API만 제공)

// --------------------------------------------------------------------------------
// |  즉, 이번 단원은 안전하지 않은(쓰레드간의 메세지 등..)을 어떻게 안전하게 처리할것인가 ? 에 집중하자  |
// --------------------------------------------------------------------------------

// 호출, 응답 프로토콜을 정의하자
type Protocol = {
  [command: string]: {
    in: unknown[];
    out: unknown;
  };
};

// 워커에 파일 경로를 제공하고 함수를 반환할 함수
function createProtocol<P extends Protocol>(script: string) {
  // 프로토콜타입과 script 경로를 전달후 커맨드 받는 함수 반환
  return <K extends keyof P>(
      command: K // 커맨드를 받아 익명함수 반환
    ) =>
    (
      ...args: P[K]['in'] // in 타입에 따라 익명함수 호출
    ) =>
      new Promise<P[K]['out']>((resolve, reject) => {
        const worker = new Worker(script);
        worker.onerror = reject;
        worker.onmessage = (event) => resolve(event.data.data);
        worker.postMessage({ command, args });
      });
}

const runWithMatrixProtocol = createProtocol<MatrixProtocol>(
  'MatrixWorkerScript.js'
);

const parallelDeterminant = runWithMatrixProtocol('determinant');

const result = parallelDeterminant([
  [1, 2],
  [3, 4],
]).then((result) => console.log(result));
