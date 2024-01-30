// 매핑된 타입 - 객체가 특정 키 집합을 정의하도록 강제하는 (더 강력한) 방법 2

// 인덱스 시그니처와 마찬가지로 한 객체당 최대 한 개의 매핑된 타입을 가질 수 있다.
// 매핑된 타입은 객체의 키와 값 타입을 매핑하는 수단을 제공한다.
let nextDay2: { [K in Weekday]: Day } = {
  Mon: "Tue",
  // Tue: "Wed",
  // Wed: "Thu",
  // Thu: "Fri",
  // Fri: "Sat",
};

// 실제로 타입스크립트는 내장 Record 타입을 구현하는 데 매핑된 타입을 이용한다.
// 매핑된 타입은 Record 타입보다 강력하다. 객체의 키와 값에 타입을 제공할 뿐 아니라, 키인 타입과 조합하면 키 이름별로 매핑할 수 있는 값 타입을 제한할 수 있기 때문이다.
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

/** 내장 매핑된 타입
 * - `Record<Keys, Values>`
 * : Keys 타입의 키와 Values 타입의 값을 갖는 객체
 * - `Partial<Object>`
 * : Object의 모든 필드를 선택형으로 표시
 * - `Required<Object>`
 * : Object의 모든 필드를 필수형으로 표시
 * - `Readonly<Object>`
 * : Object의 모든 필드를 읽기 전용으로 표시
 * - `Pick<Object, Keys>`
 * : 주어진 Keys에 대응하는 Object의 서브타입을 반환
 */
