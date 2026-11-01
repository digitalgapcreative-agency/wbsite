// Terminal prompt; hidden mode prints nothing while you type (for passwords).
import readline from 'node:readline';

let rl;
let muted = false;
const queued = [];
const waiting = [];

function iface() {
  if (rl) return rl;
  rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: Boolean(process.stdin.isTTY) });
  const write = rl._writeToOutput.bind(rl);
  rl._writeToOutput = (s) => { if (!muted) write(s); };
  rl.on('line', (line) => {
    if (muted) { muted = false; process.stdout.write('\n'); }
    const next = waiting.shift();
    if (next) next(line);
    else queued.push(line);
  });
  rl.on('close', () => { while (waiting.length) waiting.shift()(''); });
  return rl;
}

export function ask(question, { hidden = false } = {}) {
  const r = iface();
  r.setPrompt(question);
  r.prompt();
  if (queued.length) {
    if (!process.stdin.isTTY) process.stdout.write('\n');
    return Promise.resolve(queued.shift());
  }
  if (hidden && process.stdin.isTTY) muted = true;
  return new Promise((resolve) => waiting.push(resolve));
}

export function closePrompt() {
  if (rl) rl.close();
}
