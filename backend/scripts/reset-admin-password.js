import 'dotenv/config';
import bcrypt from 'bcryptjs';
import readline from 'node:readline';
import { connectToMongo, findAdminByEmail, updateAdminPassword } from '../src/utils/database.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const askHidden = (question) =>
    new Promise((resolve) => {
        process.stdout.write(question);

        let password = '';

        const onData = (chunk) => {
            const char = chunk.toString();

            if (char === '\n' || char === '\r') {
                process.stdin.setRawMode(false);
                process.stdin.pause();
                process.stdin.removeListener('data', onData);
                process.stdout.write('\n');
                resolve(password);
                return;
            }

            if (char === '\u0003') {
                process.stdout.write('\n');
                process.exit(1);
            }

            if (char === '\u007f') {
                password = password.slice(0, -1);
                return;
            }

            password += char;
        };

        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', onData);
    });

try {
    if (!process.env.MYSQL_HOST || !process.env.MYSQL_DATABASE) {
        throw new Error('MYSQL_HOST and MYSQL_DATABASE must be configured.');
    }

    if (!ADMIN_EMAIL) {
        throw new Error('ADMIN_EMAIL is not configured.');
    }

    console.log('========================================');
    console.log(' DGAP — ADMIN PASSWORD RESET');
    console.log('========================================');
    console.log(`Admin: ${ADMIN_EMAIL}`);
    console.log('');

    const password = await askHidden('New password: ');
    const confirmPassword = await askHidden('Confirm password: ');

    if (password.length < 12) {
        throw new Error(
            'Password must contain at least 12 characters.'
        );
    }

    if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
    }

    await connectToMongo();

    const admin = await findAdminByEmail(ADMIN_EMAIL);

    if (!admin) {
        throw new Error('Admin account not found.');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await updateAdminPassword(admin.id, passwordHash);

    console.log('');
    console.log('========================================');
    console.log(' PASSWORD RESET SUCCESSFUL');
    console.log('========================================');
    console.log(`Admin: ${ADMIN_EMAIL}`);
    console.log('Password hash: UPDATED');
    console.log('========================================');

    process.exit(0);
} catch (error) {
    console.error('');
    console.error('PASSWORD RESET FAILED:');
    console.error(error.message);
    process.exit(1);
}
