import askAsync, { isValid } from './module';
// Option Type: 특수 목적 데이터 타입을 사용해 예외를 표현하는 방법
// 예외를 처리하는 타입에는 대표적으로 Try, Option, Either 데이터 타입등이 있음(JS 내장 모듈이 아니기 때문에 NPM에서 설치해야 함)

// Option 타입은 하스켈, 오캐멀, 스카라, 러스트 등의 언어에서 가지고 온 개념 Maybe 타입이라고 부르기도 한다.
// 어떤 특정 값을 반환하는 대신 값을 포함하거나 포함하지 않을 수도 있는 컨테이너를 반환

// 배열로 Option 타입을 구현한 경우
function parse(birthday: string): Date[] {
  const date = new Date(birthday);
  if (!isValid(date)) {
    return [];
  }

  return [date];
}

// 언제든 실패할 수 있는 여러 동작을 연쇄적으로 수행할 때(반복문 등) Option의 진가가 발휘된다.
async function run() {
  const answer = await askAsync('생일을 입력해주세요');
  const date = parse(answer);

  // Option 타입을 사용해 구현했기 때문에 에러가 발생하지는 않는다.
  // 날짜 변환에 실패했다는 것을 값이 없음으로 안전하게 표현한 것
  date
    .map(date => date.toISOString())
    .forEach(date => {
      console.info('날짜는', date);
    });
}

// 하지만 이런 Option 타입도 에러가 발생했을 때 사용자에게 알려주지 않고 단지 무엇인가 잘못되었다는 사실만 알 수 있다.
run();
