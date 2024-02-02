var input = document.querySelector('input');
var worker = new Worker('WorkerScript.js');
input.addEventListener('input', function (e) {
    var target = e.target;
    worker.postMessage(target.value);
});

