// 타입스크립트에서는 간단한 조건을 다양한 방식으로 표현할 수 있다.(조건부 타입, 오버로드된 함수 시그니처, 매핑된 타입 등)
// 분배 법칙을 따르기 때문이다.

type ToArray<T> = T[];
type C = ToArray<number>;
type D = ToArray<number | string>;

// 조건부 타입을 사용하면 타입스크립트는 유니온 타입을 조건부의 절들로 분배한다.
// 조건부 타입을 가져다가 유니온의 각 요소로 매핑(분배)하는 것과 같은 결과다.
type ToArray2<T> = T extends unknown ? T[] : T[];
type E = ToArray2<number>;
type F = ToArray2<number | string>;

// "T에는 존재하지만 U에는 존재하지 않는 타입"
type Without<T, U> = T extends U ? never : T;
type G = Without<boolean | number | string, boolean>;
/**
 * type G = Without<boolean, boolean> | Without<number, boolean> | Without<string, boolean>;
 * type G = never | number | string;
 * type G = number | string;
 */
