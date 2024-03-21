// ------------------ import export ------------------

// default export 지원
export default function print() {
  console.log('default export');
}

// import print from './(02)importExport';

// * as 키워드를 사용한 모듈의 전체 import
// import * as print from './(02)importExport';

// 다음과 같이 단일 export를 사용할 수 있다.
// print.default();

// 타입스크립트는 값과 타입을 한개의 이름으로 내보낼 수 있다.
export type Print = () => void;
export const Print = () => {
  console.log('엘레레레레');
};

// import { Print } from './(02)importExport';
// print();

// --- 동적 import ---
// 1. splitting 기법에서 활용
//  -> 큰 네트워크를 병렬로딩
// 2. lazy loading -> 필요한 시점에 로딩
//  -> moment.js와 같이 특정 지역 날짜만 로딩가능

(async function () {
  const locale = await import(`./locale/${navigator.language}`);
})();

// 타입 안전성을 위한 import type
// 1. import에 직접 리터럴로 제공
// 2. import 에 표현식 전달 및 시그니처 명시 (오직 타입위치에만 사용)
// import { locale } from './locales/ko-KR';
// async function App() {
//   const userLocale = await getUserLocale();
//   const path = `./locales/${userLocale}`;
//   const localeKR: typeof locale = await import(path); // 값이 아닌 타입만 가져왔기에 정적컴파일 (타입안정성 up)
// }

// commonJS 의 default export는 import할때 와일드카드를 사용하자
// import * as fs from 'fs';
// fs.readFile('path')

// 10.2.3 export의 포함 유무로 모듈, 스크립트 모드의 결정
// 모듈 모드 : export 키워드 포함
// 스크립트 모듈 : export 키워드 미포함 => 전역객체에 바인딩(최상위 수준)
