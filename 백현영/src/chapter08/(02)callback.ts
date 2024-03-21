// -------------------- callback --------------------
import * as fs from 'fs';

fs.readFile(
  'var/log/apache2/access.log',
  { encoding: 'utf-8' },
  (err, data) => {
    if (err) {
      console.error('failure', err);
      return;
    }
    console.log('success', data);
  }
);

fs.appendFile('var/log/apache2/access.log', 'New access log entry', (err) => {
  if (err) {
    console.error('failure', err);
  }
});

// summary
// readFile로 읽어들인게 appendFile의 로그에 있을지는 확실하지않다 -> 비동기이기때문에
// 그렇기에 callback 패턴을 사용해야하고 이는 컴파일타임에 자동으로 잡을 수 없다.
