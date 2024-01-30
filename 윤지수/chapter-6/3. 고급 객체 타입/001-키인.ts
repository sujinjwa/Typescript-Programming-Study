// 모든 형태(객체, 클래스 생성자, 클래스 인스턴스)와 배열에 키인(key in)할 수 있다.
// 키인으로 프로퍼티 타입을 찾을 때 점이 아니라 대괄호 표기법을 사용한다.

// 선택한 소셜 미디어 API에서 받은 GraphQL API 응답을 모델링하는 복잡한 중첩 타입
type APIResponse = {
  user: {
    userId: string;
    friendList: {
      count: number;
      friends: {
        firstName: string;
        lastName: string;
      }[];
    };
  };
};

// 응답 타입에 키인하는 방법
type FriendList = APIResponse["user"]["friendList"];

// number는 배열 타입에 키인을 적용하는 핵심이다. 튜플에서는 0, 1 또는 키인하려는 인덱스를 가리키는 숫자 리터럴 타입을 사용할 수 있다.
type Friend = FriendList["friends"][number];

function getAPIResponse(): Promise<APIResponse> {
  // ...
}
function renderFriendList(friendList: FriendList) {
  // ...
}

let response = await getAPIResponse();
renderFriendList(response.user.friendList);
