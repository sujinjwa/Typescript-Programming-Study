import askAsync, { isValid } from './module';

// 언제든 실패할 수 있는 여러 동작을 연쇄적으로 수행할 때(반복문 등) Option의 진가가 발휘된다.

// 사용자의 입력을 받는 함수도 실패할 수 있다고 가정하고 Option 타입으로 구현하자
async function ask() {
  const answer = await askAsync('생일을 입력해주세요');

  if (answer === null) {
    return [];
  }

  return [answer];
}

function parse(birthday: string): Date[] {
  const date = new Date(birthday);

  if (!isValid(date)) {
    return [];
  }

  return [date];
}

async function run() {
  const arr = await ask();

  arr
    .map(parse)
    .flat() // 2. 평탄화
    .map(date => {
      // 1. Date의 배열(Date[])을 배열로 매핑했기 때문에 에러가 발생 평탄화해서 해결할 수 있다. (date: [date])
      return date.toISOString();
    })
    .forEach(date => console.info('날짜는', date));
}

run();
