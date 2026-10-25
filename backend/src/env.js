// Loaded first by server.js. Hostinger writes the hPanel variables to a .env file in the app root.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, '../../.env') }); // project root
dotenv.config({ path: path.resolve(here, '../.env') }); // backend/.env (optional)
dotenv.config(); // current working directory (never overrides values already set)
