// 타입스크립트에 zip이 무엇인지 설명
// 인터페이스 합치기 기능
// 파일에서 import나 export를 명시하지 않았으므로 기존의 전역 인터페이스와 같은 이름인 Array<T> 인터페이스를 직접 선언할 수 있었고 타입스크립트는 자동으로 둘을 합쳐준다.
interface Array<T> {
  zip<U>(list: U[]): [T, U][];
}

// .zip 구현
Array.prototype.zip = function <T, U>(this: T[], list: U[]): [T, U][] {
  return this.map((v, k) => tuple(v, list[k]));
};

// interface Array<T>를 선언할 때 전역 Array 네임스페이스에 추가 => 다른 파일에서 zip.ts를 임포트하지 않아도 [].zip을 이용할 수 있으리라 짐작된다.
// 하지만 Array.prototype에 기능을 추가하려면 zip을 사용하는 모든 파일이 zip.ts를 먼저 로드해야 한다.
// 프로젝트에서 zip.ts를 명시적으로 제외하도록 tsconfig.json을 수정하면 된다. 그러면 이 기능을 사용하는 쪽에서 명시적으로 임포트해야 한다.
