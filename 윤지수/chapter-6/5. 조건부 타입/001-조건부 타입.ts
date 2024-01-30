// 조건부 타입 - "u와 v 타입에 의존하는 T 타입을 선언하라. U <: V면 T를 A에 할당하고, 그렇지 않으면 T를 B에 할당하라"
// 조건부 타입은 타입 별칭 외에도 타입을 사용할 수 있는 거의 모든 곳(인터페이스, 클래스, 매개변수 타입, 함수와 메서드의 제네릭 기본값 등)에 사용할 수 있다.

// "T는 string의 서브타입인가?""
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;
type B = IsString<number>;
