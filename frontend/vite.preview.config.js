// Single-file preview build (for reviewing the design before deploying). Not used in production.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));

/** Inline every /images/... reference as a data URI so the preview is one self-contained file. */
function inlinePublicImages() {
  const toData = (p) => {
    const file = path.join(root, 'public', p);
    if (!fs.existsSync(file)) return null;
    const ext = path.extname(file).slice(1).replace('jpg', 'jpeg').replace('svg', 'svg+xml');
    return `data:image/${ext};base64,${fs.readFileSync(file).toString('base64')}`;
  };
  return {
    name: 'inline-public-images',
    enforce: 'pre',
    transform(code, id) {
      if (!/\/src\/.*\.(jsx?|css)$/.test(id)) return null;
      return code.replace(/(['"`])(\/images\/[^'"`]+\.(?:webp|jpg|png|svg))\1/g, (m, q, p) => {
        const d = toData(p);
        return d ? `${q}${d}${q}` : m;
      });
    }
  };
}

export default defineConfig({
  root,
  plugins: [inlinePublicImages(), react(), viteSingleFile()],
  define: { 'import.meta.env.VITE_PREVIEW': JSON.stringify('1') },
  build: { outDir: 'preview-dist', emptyOutDir: true, assetsInlineLimit: 100000000 }
});
