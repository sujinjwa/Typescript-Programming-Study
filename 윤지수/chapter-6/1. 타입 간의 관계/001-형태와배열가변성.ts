type ExsitingUser = {
  id: number;
  name: string;
};

type NewUser = {
  name: string;
};

function deleteUser(user: { id?: number; name: string }) {
  delete user.id;
}

let existingUser: ExsitingUser = {
  id: 123456,
  name: "jisoo",
};

deleteUser(existingUser);

// 타입스크립트는 user의 id가 삭제된 사실을 알지 못한다. 여전히 existingUser.id가 number 타입일 것이라 생각한다.
const id = existingUser.id;

type LegacyUser = {
  id?: number | string;
  name: string;
};

let legacyUser: LegacyUser = {
  id: "123456",
  name: "jisoo",
};

// 슈퍼타입의 id는 string | number | undefined인데 반해 deleteUser는 id가 number | undefined인 상황만 처리할 수 있다.
deleteUser(legacyUser);

// 어떤 형태를 요구할 때 건넬 수 있는 타입은 요구되는 타입에 포함된 프로퍼티 각각에 대해 '<: 기대하는 타입'인 프로퍼티들을 가지고 있어야 한다.
// 타입과 관련해 타입스크립트 형태(객체와 클래스)는 그들의 프로퍼티 타입에 공변한다고 말한다.(객체 타입과 그 멤버들은 공변 관계)

/**
 * - 불변
 * 정확히 'T'를 원함
 * - 공변
 * '<:T'를 원함
 * - 반변
 * '>:T'를 원함
 * - 양변
 * '<:T' 또는 '>:T'를 원함
 */

// 타입스크립트에서 모든 복합 타입의 멤버(객체, 클래스, 배열, 함수, 반환 타입)는 공변이며 함수 매개변수 타입만 예외적으로 반변이다.
