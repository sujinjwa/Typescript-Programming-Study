// 특정 명령이 특정한 한 가지 이벤트만 받도록 제한하려면?

// 함수 실행을 다른 스레드에 맡길 수 있는 간단한 호출/응답 프로토콜
// 함수 자체를 다른 스레드로 전달하기는 어렵지만, 워커 스레드에서 함수를 정의하고 인수를 전달해 실행 결과를 돌려받을 수는 있다.

type Matrix = number[][];

type MatrixProtocol = {
  determinant: {
    in: [Matrix];
    out: number;
  };
  "dot-product": {
    in: [Matrix, Matrix];
    out: Matrix;
  };
  invert: {
    in: [Matrix];
    out: Matrix;
  };
};

type Protocol = {
  [command: string]: {
    in: unknown[];
    out: unknown;
  };
};

// 제네릭 P는 프로토콜의 서브타입, 매개변수로 받는 스크립트에 메시지를 보내는 함수를 만드는 함수이다.
function createProtocol<P extends Protocol>(script: string) {
  return <K extends keyof P>(command: K) =>
    (...args: P[K]["in"]) =>
      new Promise((resolve, reject) => {
        const worker = new Worker(script);
        worker.onerror = () => reject();
        worker.onmessage = (event) => resolve(event.data.data);
        worker.postMessage({ command, args });
      });
}

// 메시지를 보낼 스크립트 파일
const runWithMatrixProtocol = createProtocol<MatrixProtocol>(
  "MatrixWorkerScript.js"
);

// 함수 내부의 함수를 사용해 웹 워커로 스크립트에 보낼 커맨드 지정
const parallelDeterminant = runWithMatrixProtocol("determinant");

// 또 함수 내부의 함수로 데이터를 보내고, 워커 스크립트에서 응답을 받아 콘솔에 출력
parallelDeterminant([
  [1, 2],
  [3, 4],
]).then((determinant) => console.log(determinant));
