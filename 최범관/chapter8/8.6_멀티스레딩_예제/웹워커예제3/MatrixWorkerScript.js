onmessage = function (data) {
  matrixCalculator(data.data.command);
};
function matrixCalculator(command) {
  switch (command) {
    case 'determinant':
      postMessage({ data: -2 });
      break;
    // ...
  }
}
