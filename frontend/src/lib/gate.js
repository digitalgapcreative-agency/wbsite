/* A tiny "page may animate in now" gate shared by the preloader, page curtain and pages. */
let release = null;
// Starts closed in the browser so pages mounted before the preloader finishes wait for it.
let gate = typeof window !== 'undefined' ? new Promise((res) => (release = res)) : Promise.resolve();

export function closeGate() {
  gate = new Promise((res) => (release = res));
  return gate;
}

export function openGate() {
  if (release) {
    release();
    release = null;
  }
}

export function whenOpen() {
  return gate;
}
