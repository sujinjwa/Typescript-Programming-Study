function isString(a: unknown): boolean {
  return typeof a === "string";
}

isString("a"); // true
isString([7]); // false

// 타입 정제는 강력하지만 현재 영역(유효범위)에 속한 변수만을 처리할 수 있다는 점이 문제다.
// 한 영역에서 다른 영역으로 이동하면 기존의 정제 결과물은 사라져버린다.
// 결국 타입스크립트가 알고 있는 사실은 isString이 boolean을 반환한다는 것 뿐이다.
// 따라서 타입 검사기에 isString이 boolean을 반환할 뿐 아니라 boolean이 true면 isString에 전달할 인수가 string임을 알려야 한다.
function parseInput(input: string | number) {
  let formattedInput: string;
  if (isString(input)) {
    formattedInput = input.toUpperCase();
  }
}

// 사용자 정의 타입 안전 장치: is 연산자 사용
// 타입 안전 장치는 타입스크립트의 내장 기능으로 typeof와 instanceof로 타입을 정제할 수 있게 해준다.
// 매개변수 타입을 정제하고 boolean을 반환하는 함수가 있다면 사용자 정의 타입 안전 장치를 이용해 함수가 제대로 동작함을 보장하도록 만들 수 있다.
function isString(a: unknown): a is string {
  return typeof a === "string";
}

// 사용자 정의 타입 안전 장치는 매개변수 하나에만 적용할 수 있지만 (유니온과 인터섹션 같은) 복합 타입에도 적용할 수 있다.
type LegacyDialogA =;
type DialogA =;

function isLegacyDialog(
	dialog: LegacyDialogA | DialogA
): dialog is LegacyDialogA {
	// ...
}