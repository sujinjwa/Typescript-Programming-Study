// 콜백 - 비동기 자바스크립트 프로그램의 기본 단위
// 동기 프로그램처럼 특정 함수가 고유한 동작을 완료하면 호출자가 건넨 콜백 함수를 호출한다.

// 타입만으로 함수가 비동기인지 여부를 알려줄 수 없다.
// 비동기 코드가 호출하는 콜백은 보통의 함수라서 비동기로 호출됨을 알리는 전용 타입 시그니처는 존재하지 않는다.
// readFile이나 callback은 모두 일반 자바스크립트 함수일 뿐 특별한 타입을 갖고 있지 않다.
// 시그니처만 봐서는 readFile이 비동기로 동작하며 readFile을 호출한 다음 제어가 바로 다음 행으로 넘어간다는 사실을 알 수 없다.
function readFile(path: string, options: { encoding: string; flag?: string }, callback: (err: Error | null, data: string | null) => void): void;
