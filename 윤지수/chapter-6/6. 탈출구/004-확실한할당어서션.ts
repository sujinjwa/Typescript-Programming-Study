// 타입스크립트는 확실한 할당 검사용으로 nonnull 어서션을 적용하는 특별한 상황에 사용할 특수 문법을 제공한다.

// let userId: string;
// fetchUser();

// userId.toUpperCase();

// 확실한 할당 어서션
// userId를 사용하는 시점에는 이 변수가 반드시 할당되어 있을 것임을 타입스크립트에 알려줄 수 있다.
let userID!: string;
fetchUser();

userId.toUpperCase();

function fetchUser() {
  userId = globalCache.get("userId");
}
