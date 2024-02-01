setTimeout(() => console.info('A'), 1);
setTimeout(() => console.info('B'), 1);
console.info('C');

// 위 작업은 C, A, B 순으로 출력

// Why🤔?
// 자바스크립트는 단일 콜 스택을 사용하므로 한 번에 하나의 일만 처리할 수 있다.
// 콜 스택은 자바스크립트가 실행해야 할 작업들이 쌓이는 공간
// 비동기 작업은 콜백 큐에 담기게 되고 일반 함수들은 콜 스택에 쌓이게 됩니다.
// 비동기 작업들은 콜백 큐에서 대기하다, 일반 함수가 모두 처리되어 콜 스택이 텅 비는 시점에 이벤트 루프를 돌린다.(스택에 삽입)
// 간단하게 말하자면 감자칩 통에 넣고, 감자칩을 빼먹는 것(LIFO)

function multiply(x: number, y: number) {
  return x * y;
}

function printSquare(x: number) {
  const result = multiply(x, x);
  console.log(result);
}

printSquare(5);

// 위 함수를 실행하는 자바스크립트 엔진의 동작
// 1. printSqaure(5) 함수가 콜 스택에 쌓인다.
//  Call Stack = [printSqaure(5)]

// 2. printSqaure 함수 내부에 multiply(x, x)함수가 존재하기 때문에 콜 스택에 쌓임
//  Call Stack = [printSqaure(5), multiply(x, x)]

// 3. multiply 함수 내부에는 콜 스택에 쌓일 함수가 없으므로 multiply 함수가 실행
// Call Stack = [printSqaure(5)]

// 4. 다음 구문으로 넘어가 printSqaure 함수 내부의 log 함수가 콜 스택에 쌓임
//  Call Stack = [printSqaure(5), console.log(result)]

// 5. log 함수 실행
//  Call Stack = [printSqaure(5)]

// 6. printSqaure 함수가 콜 스택에서 제거
//  Call Stack = []
