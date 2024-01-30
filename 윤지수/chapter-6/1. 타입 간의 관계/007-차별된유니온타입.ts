// 유니온의 멤버가 서로 중복될 수 있으므로 타입스크립트는 유니온의 어떤 타입에 해당하는지를 조금 더 안정적으로 파악할 수 있어야 한다.

// 리터럴 타입을 이용해 유니온 타입이 만들어낼 수 있는 각각의 경우를 태그하는 방식
type UserTextEvent = { type: "TextEvent"; value: string; target: HTMLInputElement };
type UserMouseEvent = { type: "MouseEvent"; value: [number, number]; target: HTMLElement };

type UserEvent = UserTextEvent | UserMouseEvent;

function handle(event: UserEvent) {
  /*
  if (typeof event.value === "string") {
    event.value; // string
    event.target; // HTMLInputElement | HTMLElement
    return;
  }
  event.value; // [number, number]
  event.target; // HTMLInputElement | HTMLElement
  */

  // 태그는 유니온 타입에서 고유하므로 타입스크립트는 둘이 상호 배타적임을 알 수 있다.
  if (event.type === "TextEvent") {
    event.value; // string
    event.target; // HTMLInputElement
    return;
  }
  event.value; // [number, number]
  event.target; // HTMLElement
}

// 💡 유니온 타입의 다양한 경우를 처리하는 함수를 구현해야 한다면 태그된 유니온을 사용하자.

/** 좋은 태그의 조건
 * - 유니온 타입의 각 경우와 같은 위치에 있다. 객체 타입의 유니온에서는 같은 객체 필드를 의미하고, 튜플 타입의 유니온이라면 같은 인덱스를 의미한다. 보통 태그된 유니온은 객체 타입을 사용한다.
 * - 리터럴 타입이다(리터럴 문자, 리터럴 숫자, 리터럴 불 등). 다양한 리터럴 타입을 혼합하고 매치할 수 있지만 한 가지 타입만 사용하는 것이 바람직하다. 보통은 문자열 리터럴 타입을 사용한다.
 * - 제네릭이 아니다. 태그는 제네릭 타입 인수를 받지 않아야 한다.
 * - 상호 배타적이다(예를 들어 유니온 타입 내에서 고유함).
 */
