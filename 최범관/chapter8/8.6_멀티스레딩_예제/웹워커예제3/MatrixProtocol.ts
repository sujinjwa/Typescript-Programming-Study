// 타입 안전 프로토콜
// 두 스레드 간 양방향으로 통신하는 기능을 살펴봤다.
// 이 기능을 확장해 특정 명령이 어떤 하나의 이벤트만 받도록 제한하려면 어떻게 할 수 있을까?

// 행렬 수학 엔진을 개발
type Matrix = number[][];
type MatrixProtocol = {
  determinant: {
    in: [Matrix];
    out: number;
  };
  'dot-product': {
    in: [Matrix, Matrix];
    out: Matrix;
  };
  invert: {
    in: [Matrix];
    out: Matrix;
  };
};

// 행렬은 메인 스레드에서 정의하고 모든 계산은 워커에서 실행한다.
// 이번에도 안전한 동작만 주고 받을 수 있도록 타입이 명시된 API만 제공하겠다.
type Protocol = {
  [command: string]: {
    in: unknown[];
    out: unknown;
  };
};

function createProtocol<P extends Protocol>(script: string) {
  return <K extends keyof P>(command: K) =>
    // 다시 한 번 외부로 배열을 받는 함수를 빼준다.
    (...args: P[K]['in']) =>
      new Promise((resolve, reject) => {
        const worker = new Worker(script);
        // worker.onerror = () => reject();
        worker.onmessage = event => resolve(event.data.data);
        worker.postMessage({ command, args });
      });
}

const runWithMatrixProtocol = createProtocol<MatrixProtocol>(
  'MatrixWorkerScript.js'
);

const parallelDeterminant = runWithMatrixProtocol('determinant');

parallelDeterminant([
  [1, 2],
  [3, 4],
]).then(determinant => console.log(determinant));
