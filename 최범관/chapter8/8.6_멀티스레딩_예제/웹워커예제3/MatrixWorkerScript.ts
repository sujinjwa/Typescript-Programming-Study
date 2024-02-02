onmessage = data => {
  console.log(data);
  matrixCalculator(data.data.command);
};

function matrixCalculator(command: string) {
  switch (command) {
    case 'determinant':
      postMessage({ data: -2 });
      break;
    // ...
  }
}
