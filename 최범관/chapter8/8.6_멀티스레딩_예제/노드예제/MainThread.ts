import { fork } from 'child_process';

// NodeJs의 fork API로 새 자식 프로세스 생성
const child = fork('./ChildThread.js');

// on 메소드로 자식 프로세스에서 들어오는 메시지를 리스닝합니다.
child.on('message', data => {
  console.info('Child process sent a message', data);
});

// send 메소드로 메시지를 자식 프로세스로 전송합니다.
child.send({ type: 'syn', data: [3] });
