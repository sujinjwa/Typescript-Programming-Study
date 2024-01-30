type ResponseKeys = keyof APIResponse;
type UserKeys = keyof APIResponse["user"];
type FriendListKeys = keyof APIResponse["user"]["friendList"];

function get<O extends object, K extends keyof O>(o: O, k: K): O[K] {
  return o[k];
}

// keyof를 이용하면 객체의 모든 키를 문자열 리터럴 타입 유니온으로 얻을 수 있다.
const aa = get({ aa: 123, bb: "apple", cc: true }, "aa");

type ActivityLog = {
  lastEvent: Date;
  events: {
    id: string;
    timeStamp: Date;
    type: "Read" | "Write";
  }[];
};

let activityLog: ActivityLog = ;
let lastEvent = get(activityLog, "lastEvent");

type Get = {
	<
		O extends object,
		K1 extends keyof O
	>(o: O, k1: K1): O[K1]
	<
		O extends object,
		K1 extends keyof O,
		K2 extends keyof O[K1]
	>(o: O, k1: K1, k2: K2): O[K1][K2]
	<
		O extends object,
		K1 extends keyof O,
		K2 extends keyof O[K1],
		K3 extends keyof O[K1][K2]
	>(o: O, k1: K1, k2: K2, k3: K3): O[K1][K2][K3]
}

let get2:Get = (object: any, ...keys: string[]) => {
	let result = object
	keys.forEach(k => result = result[k])
	return result;
}

const type = get2(activityLog, 'events', 0, 'type')
const bad = get2(activityLog, 'bad')