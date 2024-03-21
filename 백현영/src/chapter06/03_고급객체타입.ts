// ---------------- keyin ----------------

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

type FriendList = APIResponse['user']['friendList'];

// ---------------- keyof ----------------
// 프로퍼티만 가져온다

type UserKeys = keyof APIResponse['user']; // 'userId' | 'friendList'
type FriendListKeys = keyof APIResponse['user']['friendList']; // 'count' | 'friends'

function get<O extends object, K extends keyof O>(o: O, k: K): O[K] {
  return o[k];
}

// 확장해서 객체에 더 깊숙히 키인 할 수 있다.
type Get = {
  <O extends object, K1 extends keyof O>(o: O, k1: K1): O[K1];
  <O extends object, K1 extends keyof O, K2 extends keyof O[K1]>(
    o: O,
    k1: K1,
    k2: K2
  ): O[K1][K2];
  <
    O extends object,
    K1 extends keyof O,
    K2 extends keyof O[K1],
    K3 extends keyof O[K1][K2]
  >(
    o: O,
    k1: K1,
    k2: K2,
    k3: K3
  ): O[K1][K2][K3];
}; // 다만 이렇게 하면 3개까지만 가능하다.

// ❌
// const get2: Get = (o: object, ...ks: string[]) => {
//   return ks.reduce((acc, k) => acc[k], o);
// };

// 인덱스 시그니처 사용
type IndexableType = { [key: string]: any };

const get3: Get = (o: IndexableType, ...ks: string[]) => {
  return ks.reduce((acc, k) => acc[k], o);
};

// ---------------- Record ----------------
// 객체가 특정 집합의 키를 가질 때 사용한다.

type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
type Day = Weekday | 'Sat' | 'Sun';

// ❌
// const nextDay1: Record<Weekday, Day> = {
//   Mon: 'Tue',
// };

// ✅
const nextDay: Record<Weekday, Day> = {
  Mon: 'Tue',
  Tue: 'Wed',
  Wed: 'Thu',
  Thu: 'Fri',
  Fri: 'Sat',
};

// ---------------- mapped type ----------------
// : 더 멋지고 강력하게 객체타입을 선언하는 방법

// ✅
const betterNextDay: { [K in Weekday]: Day } = {
  Mon: 'Tue',
  Tue: 'Wed',
  Wed: 'Thu',
  Thu: 'Fri',
  Fri: 'Sat',
};

// **** Record와 달리 in(keyin)을 사용해 제한가능 ****
type Account = {
  id: number;
  isEmployee: boolean;
  notes: string[];
};

type OptionalAccount = {
  // 모든 필드를 선택형으로
  [K in keyof Account]?: Account[K];
};

type NullableAccount = {
  [K in keyof Account]: Account[K] | null;
};

type ReadonlyAccount = {
  readonly [K in keyof Account]: Account[K];
};

type Account2 = {
  // 모든 필드를 다시 쓰기 가능하게
  -readonly [K in keyof ReadonlyAccount]: Account[K];
};

type Account3 = {
  // 모든 필드를 필수형으로
  [K in keyof Account]-?: Account[K];
};

// 사실 내장된 Mapped Type이 있다.
// Partial, Required, Readonly, Record, Pick, Omit, Exclude, Extract, NonNullable, Parameters
// ConstructorParameters, ReturnType, InstanceType, ThisParameterType, OmitThisParameter, ThisType
// https://www.typescriptlang.org/docs/handbook/utility-types.html

// ---------------- companion object pattern ----------------
// : 객체의 타입과 값이 같은 타입 -> import할때 조심해야한다. -> 하나로 가능

// ✅
type User = {
  name: string;
};

const User = {
  name: 'jay',
};

// 네임스페이스를 이용해 타입과 값으로 2번 선언가능
// import { User } from './User'; 햇다고 가정하자

const otherUser: User = {
  name: 'jay',
};

const userName = User.name;
console.log(userName);

// ---------------- 튜플 타입추론 개선 ----------------
// : as const를 쓰면 되지만 튜플을 튜플타입으로 만드려면 ?

// 나머지 매개변수를 사용하면 인수의 순서가 보장되므로 튜플로 추론함
function tuple<T extends unknown[]>(...ts: T): T {
  return ts;
}

// 원래라면 (number | boolean)[] 였다.
const ordinaryTuple = [1, true] as const;
// 허나 지금은 [number ,boolean] 으로 추론한다
const t1 = tuple(1, true);

// ---------------- user-defined type guard ----------------

// ❌
// 자신의 유효범위에서만 타입정제 결과물을 보장한다.
// 다시말해서 isString 컨텍스트에서 정제했더라도 parseInput까지 알릴수는 없다.
// function isString(a: string): boolean {
//   return typeof a === 'string';
// }

// 반환값에 타입정보를 담아야한다.
// ✅
function isString(a: unknown): a is string {
  return typeof a === 'string';
}

function parseInput(input: string | number) {
  let formattedInput: string;
  if (isString(input)) {
    formattedInput = input.toUpperCase();
    console.log(formattedInput);
  }
}

parseInput(3);

// ---- summary ----
// 나만의 안전장치를 만들 수 있다.
// 단, 하나의 매개변수만 검사할 수 있다.

// ---------------- conditional type ----------------
// T extends U ? X : Y
// -> T가 U이면 X, 아니면 Y

// ---------------- 타입 분배 법칙 ----------------
// 수학의 분배법칙과 같다

type Without<T, U> = T extends U ? never : T;

interface UserInfo {
  id: number;
  name: string;
  vip: boolean;
}

type Name = Without<UserInfo[keyof UserInfo], number | boolean>;
// 코드를 풀어보자
// (number | string | boolean) extends (number | boolean) ? never : T;
// number extends (number | boolean) ? never : number;
// string extends (number | boolean) ? never : string;
// boolean extends (number | boolean) ? never : boolean;

// 내장된 조건부 타입

// 1. Exclude<T, U> : Without과 같다
type OnlyName = Exclude<UserInfo[keyof UserInfo], number | boolean>;

// 2. Extract<T, U> : T가 U에 할당 가능한 타입을 구한다
type VipType = Extract<UserInfo[keyof UserInfo], boolean>;

// 3. NonNullable<T> : null, undefined를 제외한 타입을 구한다
interface UserInfo2 {
  id?: number;
  name: string;
  vip: boolean;
}
type NullableIdType = UserInfo2['id'];
type NonNullIdType = NonNullable<UserInfo2['id']>;

// 4. ReturnType<F> : 함수의 반환타입을 구한다
// 🚨 제네릭과 오버로드된 함수 작동 X
function getName(obj: UserInfo2) {
  return obj.name;
}
type Name2 = ReturnType<typeof getName>;

// 5. InstanceType<C> : 클래스 생성자의 인스턴스 타입을 구한다
interface PersonObj {
  name: string;
}

type PersonCreator = { new (): PersonObj };

type PersonType = InstanceType<PersonCreator>;

// ----------------- Nonnull assertion -----------------
// 타입 어설션과 같지만 `특정한` 상황에서 null | undefined이 아님 단언함

interface Dialog {
  id?: string;
}

function removeFromDom(dialog: Dialog, element: HTMLElement) {
  if (dialog.id) {
    element.remove();
  }
}

function closeDialog(dialog: Dialog) {
  if (!dialog.id) return;

  // ❌
  // 위에서 dialog.id에 대한 예외처리를 했지만 유효범위가 바뀌었기에 타입스크립트는 모른다.
  // setTimeout(() => {
  //   removeFromDom(dialog, document.getElementById(dialog.id)); //
  // }, 1000);

  // 🤔
  // 허나 이렇게 타입단언을 하는게 좋을까 ?
  // setTimeout(() => {
  //   removeFromDom(dialog, document.getElementById(dialog.id!)!);
  // }, 1000);
}

// 👍
interface VisibleDialog {
  id: string;
}

interface DestroyedDialog {}

type BetterDialog = VisibleDialog | DestroyedDialog;

function betterCloseDialog(dialog: BetterDialog) {
  if (!('id' in dialog)) return;

  // 정제결과가 removeFromDom에서도 이어진다.
  removeFromDom(dialog, document.getElementById(dialog.id)!);
}

// --- summary ---
// 타입스크립트가 이해할 수 있게 유효범위를 이어주는게 좋은것 같다.
// 1. 자바스크립트 코드로써 알리기 -> 런타임에도 이어짐
// 2. is로 타입가드 반환값 알리기 (chpater06 user-defined type guard) -> 컴파일타임에만
// 2-1. is 키워드는 타입가드(타입좁히기)에만 사용되므로 boolean으로 평가되어야한다.

// ---------------------- branding ----------------------
// 구조기반 타입인 타입스크립트에서 이름기반으로 타입을 다르게 인식하고싶어질때 -> symbol branded !

// 😭
// type UserID = string
// type CompanyID = string
// type OrderID = string
// type ID = UserID | CompanyID | OrderID

// 👍
type UserID = string & {
  readonly _brand: unique symbol;
};
type CompanyID = string & {
  readonly _brand: unique symbol;
};
type OrderID = string & {
  readonly _brand: unique symbol;
};
type ID = UserID | CompanyID | OrderID;

function UserID(id: string) {
  return id as UserID;
}

function CompanyID(id: string) {
  return id as CompanyID;
}

function queryForUser(id: UserID) {
  // ...
}

// ❌
// const companyID = CompanyID('qwer');
// queryForUser(companyID)

export {};
