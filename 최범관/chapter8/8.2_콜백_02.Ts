import * as fs from 'fs';
// 왜 기본 단위는 콜백?
// 비동기: 실행 순서를 보장받을 수 없는 작업 기다려주지 않는다.
// 비동기를 동기처럼 처리하기 위해서는 어떻게 할 수 있을까?
// 1. callBack Function
// 2. Promise
// 3. async / await

// Disk file 내용 비동기로 읽을 때
// fs.readFile
// 내장 API callBack(error: Error | null, data: string | null) => void

// 아래 두 작업은 비동기 작업이다. 만일 파일에 어떤 내용을 추가하고 읽어오려면?
// 콜백 함수 내부에 함수에 콜백 함수를 작성하고 ..
fs.appendFile(
  '최범관/chapter8/exam.txt',
  '새로운 내용 추가를 시도합니다.',
  error => {
    if (error) {
      console.error('새로운 내용을 작성하는데 오류가 발생했습니다!', error);
    }
  }
);

fs.readFile('최범관/chapter8/exam.txt', { encoding: 'utf8' }, (error, data) => {
  if (error) {
    console.error('읽어오는데 에러가 발생했습니다!', error);
    return;
  }

  console.info('읽어오는데 성공했습니다', data);
});
