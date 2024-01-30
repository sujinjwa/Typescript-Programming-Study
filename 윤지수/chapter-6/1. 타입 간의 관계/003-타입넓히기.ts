// 타입 넓히기 - 타입스크립트의 타입 추론이 어떻게 동작하는지 이해하는 데 필요한 핵심 개념

// (let이나 var로) 값을 바꿀 수 있는 변수를 선언하면 그 변수의 타입이 리터럴 값에서 리터럴 값이 속한 기본 타입으로 넓혀진다.
// 타입을 명시하면 타입이 넓어지지 않도록 막을 수 있다.

const a6 = "x";
let b6 = a6;

const c6: "x" = "x";
let d6 = c6;

// null이나 undefined로 초기화된 변수는 any 타입으로 넓혀진다.

// null이나 undefined로 초기화된 변수가 선언 범위를 벗어나면 타입스크립트는 확실한(좁은) 타입을 할당한다.
function x() {
  let a = null; // any
  a = 3; // any
  a = "b"; // any
  return a;
}

x(); // string
