/**
 * main loop
 * @param proc
 * @example
 * // start
 * forever(() => { console.log('forever'); });
 * // stop
 * forever(null);
 */

let lastProc = null;
let looping = true;

export default function forever(proc) {
  lastProc = proc;
  looping = !!lastProc;

  loop();
}

function loop() {
  if (lastProc) lastProc.call(null);
  if (looping) window.requestAnimationFrame(loop.bind(this));
}
