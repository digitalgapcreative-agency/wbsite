import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createAdmin, connectToMongo } from '../src/utils/database.js';

const run = async () => {
    try {
        await connectToMongo();

        const email = process.argv[2];
        const password = process.argv[3];

        if (!email || !password) {
            console.error('Usage: node create-admin.js <email> <password>');
            process.exit(1);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await createAdmin({ email, passwordHash });

        console.log(`✅ Admin user ${email} created successfully.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating admin:', err.message);
        process.exit(1);
    }
};

run();
