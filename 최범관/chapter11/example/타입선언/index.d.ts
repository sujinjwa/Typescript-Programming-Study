// tsc -d 옵션을 통해 d.ts 파일 생성
// 타입에 대한 선언을 declare 키워드로 만들어줌
declare class Test {
  name: string;
  age: number;
  gender: '남' | '여';
  constructor(name: string, age: number, gender: '남' | '여');
  sayName(): void;
}
