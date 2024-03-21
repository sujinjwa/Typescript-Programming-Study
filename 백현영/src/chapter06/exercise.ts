// Q.3 Exclusive 구현하기
type MyExclusive<T, U> = (T extends U ? never : T) | (U extends T ? never : U);

type Exclusive<T, U> = Exclude<T, U> | Exclude<U, T>;

type Test = MyExclusive<1 | 2 | 3, 2 | 3 | 4>; // 1 | 4

// Q.4 할당 어설션 사용 안하도록 리팩토링
const globalCache = {
  get(userID: string) {
    switch (userID) {
      case 'first':
        return 'aaa';
      case 'second':
        return 'bbb';
      case 'third':
        return 'ccc';
      default:
        return 'Unknown user';
    }
  },
};

let userID: string;
fetchUser();

userID.toUpperCase();

function fetchUser() {
  userID = globalCache.get('첫번째');
}

export default null;
