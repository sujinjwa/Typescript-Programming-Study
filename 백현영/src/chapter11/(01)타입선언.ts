// -------------- d.ts --------------
// 자바스크립트에 타입스크립트 타입을 부여해주는 파일
// 1. 타입만 포함 가능 (값 불가)
// 2. declare 키워드로 자바스크립트에 해당 값이 존재함을 알림 (타입스크립트에게 강제적 알림 as키워드)
// 3. 가시성이 확보된 대상에만 타입선언 (함수 안의 지역변수는 포함 불가)

// d.ts 예시는 ./Observable.ts 참고

// ----- ambient type declaration -----
// 명시적으로 import 하지 않아도 전역 접근 가능
type GlobalToArray<T> = T extends unknown[] ? T : T[];

// ❌ export 하면 안된다
// export default null

// *** App 전역에 사용할 수 있는 타입을 선언할때 사용
// usage
type GlobalUserID = string & { readonly brand: unique symbol };

import { eating, GlobalUser } from './@react-bhY';

declare module '@react-bhY' {
  export type GlobalUser = {
    id: GlobalUserID;
    name: string;
  };
}

const userId: GlobalUser = GlobalUser;

// ---- ambient module declaration ----
// 모듈을 사용하면서 타입을 빠르게 선언할때 사용

// declare module '@react-bhY' {
//   export type GlobalToArray<T> = T extends unknown[] ? T : T[];
//   export type GlobalUserID = string & { readonly brand: unique symbol };
//   export type GlobalUser = {
//     id: GlobalUserID;
//     name: string;
//   };
// }
