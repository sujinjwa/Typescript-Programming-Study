// ------------------ return null ------------------

// 여담
// 자바스크립트에는 각 타입마다 고유한 toStirng 메서드가 있다.
// 예를 들면 arr.toString() 은 배열의 요소를 쉼표로 구분한 문자열을 반환한다.
// 허나 여기서는 Object.prototype 즉, 내장 객체 Object의 프로토타입에 정의된 toString 메서드를 사용한다.
// Object.prototype.toString() : toString()은 "[object type]"을 반환
// call 메서드를 사용해서 this 즉, 컨텍스트를 Date로 바꿔준다.
// console.log(Object.prototype.toString.call([])); // [object Array]
// call의 0번째 인자는 지정할 this, 나머지 args는 함수의 인자로 들어간다.

// 정리
// Object.prototype.toString.call()은 객체의 [[class]] 속성을 확인하는데 쓴다
// arr.toString()은 Array.prototype.toString()을 호출한다.
// 그렇기에 Object.prototype.toString을 사용하기 위해서는 해당 메서드의 호출 주체 즉, this를 Array로 바꿔줘야한다.

export function isValid(date: Date): boolean {
  return (
    Object.prototype.toString.call(date) === '[object Date]' &&
    !Number.isNaN(date.getTime())
  );
}

export function ask(message: string) {
  // return prompt('생일이 언제인가요 ?');
  return '2020-10-10';
}

function parse(birthday: string): Date | null {
  let date = new Date(birthday);

  if (!isValid(date)) return null;

  return date;
}

function App() {
  const date = parse(ask('생일이 언제인가요 ?'));

  if (date) {
    console.info('Date is', date.toISOString());
  } else {
    console.error('Error parsing date');
  }
}
