// Record 타입 - 객체가 특정 키 집합을 정의하도록 강제하는 방법 1
// 타입스크립트의 내장 Record 타입을 이용하면 무언가를 매핑하는 용도로 객체를 활용할 수 있다.
let nextDay: Record<Weekday, Day> = {
  Mon: "Tue",
  // Tue: "Wed",
  // Wed: "Thu",
  // Thu: "Fri",
  // Fri: "Sat",
};

// Record는 일반 객체의 인덱스 시그니처에 비해 자유롭다. 일반 인덱스 시그니처에서는 객체 값의 타입은 제한할 수 있지만, 키는 반드시 일반 string, number, symbol이어야 한다. 하지만 Record에서는 객체의 키 타입도 string과 number의 서브타입으로 제한할 수 있다.
