var input8 = document.querySelector("input");
var worker = new Worker("001-WorkerScript.js");
input8.addEventListener("input", function (e) {
  var target = e.target;
  worker.postMessage(target.value);
});
