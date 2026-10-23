import { config as loadEnv } from 'dotenv';

loadEnv({ path: new URL('../.env', import.meta.url).pathname });

const { createApp } = await import('./core/app.js');

const app = createApp();

app.start();

export default app;
