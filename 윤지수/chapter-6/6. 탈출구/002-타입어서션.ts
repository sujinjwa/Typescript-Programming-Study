// 타입 B가 있고 A <: B <: C를 만족하면 타입 검사기에게 B는 실제로 A거나 C라고 어서션(assertion)할 수 있다.
// 어떤 하나의 타입은 자신의 슈퍼타입이나 서브타입으로만 어서션할 수 있다.

function formatInput(input: string) {
  // ...
}

function getUserInput(): string | number {
  // ...
}

let input = getUserInput();

// 타입 어서션 방법 1: as 문법
// input이 string이라고 어서션
formatInput(input as string);

// 타입 어서션 방법 2: 꺾쇠괄호 문법
formatInput(<string>input);
