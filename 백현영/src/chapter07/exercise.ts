interface Option<T> {
  flatMap<U>(callbackFn: (value: T) => None): None;
  flatMap<U>(callbackFn: (value: T) => Option<U>): Option<U>;
  getOrElse(value: T): T;
}

class None implements Option<never> {
  flatMap(): None {
    return this;
  }

  getOrElse<U>(value: U): U {
    return value;
  }
}

class Some<T> implements Option<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  flatMap<U>(cb: (value: T) => None): None;
  flatMap<U>(cb: (value: T) => Some<U>): Some<U>;
  flatMap<U>(cb: (value: T) => Option<U>): Option<U> {
    return cb(this.value);
  }

  getOrElse(): T {
    return this.value;
  }
}

type UserID = unknown;

declare class API {
  getLoggedInUserID(): Option<UserID>;
  getFriendIDs(userID: UserID): Option<UserID[]>;
  getUserName(userID: UserID): Option<string>;
}

function listOfOptionsToOptionOfList<T>(list: Option<T>[]): Option<T[]> {
  let empty = {};
  let result = list
    .map((_) => _.getOrElse(empty as T))
    .filter((_) => _ !== empty);
  if (result.length) {
    return new Some(result);
  }
  return new None();
}

let api = new API();
let friendsUserNames = api
  .getLoggedInUserID()
  .flatMap(api.getFriendIDs)
  .flatMap((_) => listOfOptionsToOptionOfList(_.map(api.getUserName)));

export default null;
