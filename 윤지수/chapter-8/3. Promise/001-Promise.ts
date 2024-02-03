// Promise
// 원하는 일을 완수하는 데 필요한 비동기 작업들을 직관적인 체인 하나로 엮는다.
function appendAndReadPromise(path: string, data: string): Promise<string> {
  return appendPromise(path, data)
    .then(() => readPromise(path))
    .catch((error) => console.log(error));
}

// 콜백
function appendAndRead(path: string, data: string, cb: (error: Error | null, result: string | null) => void) {
  appendFile(path, data, (error) => {
    if (error) {
      return cb(error, null);
    }
    readFile(path, (error, result) => {
      if (error) {
        return cb(error, null);
      }
      cb(null, result);
    });
  });
}
