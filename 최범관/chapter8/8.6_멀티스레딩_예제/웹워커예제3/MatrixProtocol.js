// 타입 안전 프로토콜
// 두 스레드 간 양방향으로 통신하는 기능을 살펴봤다.
// 이 기능을 확장해 특정 명령이 어떤 하나의 이벤트만 받도록 제한하려면 어떻게 할 수 있을까?
function createProtocol(script) {
    // 클로저를 외부로 빼주는건가? 아마두 그런 듯
    return function (command) {
        // 다시 한 번 외부로 배열을 받는 함수를 빼준다.
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new Promise(function (resolve, reject) {
                var worker = new Worker(script);
                worker.onerror = () => reject();
                worker.onmessage = function (event) { return resolve(event.data.data); };
                worker.postMessage({ command: command, args: args });
            });
        };
    };
}
var runWithMatrixProtocol = createProtocol('MatrixWorkerScript.js');
var parallelDeterminant = runWithMatrixProtocol('determinant');
parallelDeterminant([
    [1, 2],
    [3, 4],
]).then(function (determinant) { return console.log(determinant); });
