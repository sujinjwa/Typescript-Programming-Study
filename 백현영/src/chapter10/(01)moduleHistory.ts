// 모듈화는 캡슐화와 연관이 깊다
// 1. 캡슐화 -> 의존성 확보
// 2. 모듈간 의존성 명시
// 3. 모듈은 앱내에서 고유해야함 (식별자)

// 모듈시스템이 없을때의 자바스크립트

// nmaespace.module
// 네임스페이스 패턴을 사용해 중복을 피해왔다
window.emailList = {
  data: { email: 'qwer@naver.com' },

  renderList() {
    console.log(this.data.email);
  },
};

// commonJS의 등장

const emailList = require('./emailList');

module.exports.renderList = function () {
  console.log(emailList.data.email);
};

// commonJS문제점
// 1. require 호출은 반드시 동기적
// 2. 정적분석 불가능 (참조된 파일이 실제로 존재하는지 확인 불가능(죽은코드))

// ES6의 등장

// import emailList from './emailList';
// export function renderList() {
//   console.log(emailList.data.email);
// }
