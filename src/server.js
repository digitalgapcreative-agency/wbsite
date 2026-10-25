// Hostinger entry shim. LiteSpeed's lsnode loads the entry with require() from
// <app>/src/server.js, so this file is CommonJS (see src/package.json) and loads
// the real ES-module server with a dynamic import, which works on every Node version.
import('../backend/src/server.js').catch((err) => {
  console.error('[dgap] failed to start:', err);
  process.exit(1);
});
