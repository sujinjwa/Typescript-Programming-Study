// resolve의 매개변수 타입은 우리가 어떤 API를 사용하는지에 따라 달라지며
// reject의 매개변수 타입은 항상 Error 유형이 된다.
type Executor<T> = (resolve: (result: T) => void, reject: (error: unknown) => void) => void;

// Promise만 보고도 Promise가 어떤 타입으로 해석될지를 알고자 하므로
// (Promise<number>는 비동기 작업 결과로 number 타입을 내놓음)
// Promise를 제네릭으로 만들고 그 생성자에서 자신의 타입 매개변수들을 Executor 타입에 전달할 것이다.
class Promise<T> {
  constructor(f: Executor<T>) {}
  // Promise를 통해 연이어 실행하면서 결과를 전달하고 예외를 잡는다.
  // then과 catch를 이용해 Promise 여러 개를 연쇄적으로 호출할 수 있다.
  then<U>(g: (result: T) => Promise<U>): Promise<U> {
		// ...
	}
  catch<U>(g: (error: unknown) => Promise<U>): Promise<U> {
		// ...
	}
}

// import { readFile } from "fs";
// function readFilePromise(path: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     readFile(path, (error, result) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// }

let a8: () => Promise<string, TypeError> =;
let b8: (s: string) => Promise<number, never> =;
let c8: () => Promise<boolean, RangeError> =;

// a8이 성공하면 Promise를 b8로 매핑하고, 그렇지 않으면 첫 번째 catch 구문을 실행하면서 Promise를 c8로 매핑한다.
// c8이 성공하면 "Done"을 기록하고 거절되면 다시 마지막 catch를 실행한다.
a8()
  .then(b8)
  .catch((e) => c8())
  .then((result) => console.info("Done", result))
  .catch((e) => console.error("Error", e));

// Promise가 실제 예외를 던지는 상황(throw Error('foo') 같은 상황)도 처리해야 한다.
// 모든 Promise는 거절될 수 있는 위험이 있으며, 정적으로 이를 확인할 수 없다. 타입스크립트는 함수 시그니처로 어떤 예외가 발생할 수 있는지 알려주는 기능을 지원하지 않기 때문이다.
// Promise가 거부되었다고 항상 Error인 것은 아니다. 타입스크립트는 어쩔 수 없이 자바스크립트의 동작을 상속받는데 자바스크립트는 throw로 모든 것(에러 뿐 아니라 문자열, 함수, 배열, Promise 등)을 던질 수 있기 때문이다. 