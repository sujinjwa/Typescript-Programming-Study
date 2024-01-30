// 조건의 일부를 제네릭 타입으로 선언할 수 있는 기능
// infer 키워드 - 조건부 타입에서는 제네릭 타입을 인라인으로 선언하는 전용 문법을 제공한다.

// "배열의 요소 타입을 얻는 조건부 타입"
type ElementType<T> = T extends unknown[] ? T[number] : T;
type H = ElementType<number[]>;
// infer 키워드 이용
type ElementType2<T> = T extends (infer U)[] ? U : T;
type I = ElementType2<number[]>;

type SecondArg<F> = F extends (a: any, b: infer B) => any ? B : never;
// Array.slice의 타입 얻기
type J = (typeof Array)["prototype"]["slice"];
type K = SecondArg<J>;
