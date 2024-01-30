// Exclude<T, U> : T에 속하지만 U에는 없는 타입을 구한다.
type AA = number | string;
type BB = string;
type CC = Exclude<AA, BB>;

// Extract<T, U> : T의 타입 중 U에 할당할 수 있는 타입을 구한다.
type AA = number | string;
type BB = string;
type CC = Extract<AA, BB>;

// NonNullable<T> : T에서 null과 undefined를 제외한 버전을 구한다.
type AA = { a?: number | null };
type BB = NonNullable<AA["a"]>;

// ReturnType<F> : 함수의 반환 타입을 구한다(제네릭과 오버로드된 함수에서는 동작하지 않는다).
type FF = (a: number) => string;
type RR = ReturnType<FF>;

// InstanceType<C> : 클래스 생성자의 인스턴스 타입을 구한다.
type AA = { new (): BB };
type BB = { b: number };
type II = InstanceType<AA>;
