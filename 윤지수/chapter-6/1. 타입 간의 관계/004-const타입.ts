// const 타입 - 타입스크립트는 타입이 넓혀지지 않도록 해주는 const라는 특별 타입을 제공한다.

// const를 타입 어서션으로 활용할 수 있다.
let e6 = { x: 3 }; // {x: number}
let f6: { x: 3 }; // {x: 3}
let g6 = { x: 3 } as const; // {readonly x: 3}

// const를 사용하면 타입 넓히기가 중지되며 멤버들끼리 자동으로 readonly가 된다. 중첩된 자료구조에도 재귀적으로 적용한다.
let h6 = [1, { x: 2 }]; // (number | {x: number})[]
let i6 = [1, { x: 2 }] as const; // readonly [1, {readonly x: 2}]

// 💡 타입스크립트가 변수를 가능한 한 좁은 타입으로 추론하길 원한다면 as const를 이용하자.
