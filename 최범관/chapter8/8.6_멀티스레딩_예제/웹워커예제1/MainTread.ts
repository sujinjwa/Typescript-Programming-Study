const input = document.querySelector('input');
const worker = new Worker('WorkerScript.js');
input!.addEventListener('input', (e: Event) => {
  const target = e.target as HTMLInputElement;
  worker.postMessage(target.value);
});
