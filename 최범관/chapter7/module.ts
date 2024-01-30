const readline = require('readline');

async function askAsync(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(question);

  return new Promise(resolve => {
    rl.on('line', (line: any) => {
      resolve(line);
    });
  });
}

export function isValid(date: Date) {
  return (
    Object.prototype.toString.call(date) === '[object Date]' &&
    !Number.isNaN(date.getTime())
  );
}

export default askAsync;
