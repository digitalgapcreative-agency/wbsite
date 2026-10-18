import session from 'express-session';
import createMySQLStore from 'express-mysql-session';

const MySQLStore = createMySQLStore(session);

const isProduction = process.env.NODE_ENV === 'production';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret && isProduction) {
    throw new Error(
        'SESSION_SECRET must be configured in production.'
    );
}

const secret =
    sessionSecret ||
    'development-only-session-secret-change-this-before-production';

const hasUsableMysqlSessionConfig = Boolean(
    process.env.MYSQL_HOST &&
    process.env.MYSQL_DATABASE &&
    !/your_mysql|mysql_password|changeme|placeholder|example|dummy|replace_me|test_password/i.test(
        String(process.env.MYSQL_PASSWORD || '')
    )
);

const mysqlSessionStore = hasUsableMysqlSessionConfig
    ? new MySQLStore({
          host: process.env.MYSQL_HOST,
          port: Number(process.env.MYSQL_PORT || 3306),
          user: process.env.MYSQL_USER || 'root',
          password: process.env.MYSQL_PASSWORD || '',
          database: process.env.MYSQL_DATABASE || 'dgap',
          checkExpirationInterval: 15 * 60 * 1000,
          expiration: 8 * 60 * 60 * 1000,
          createDatabaseTable: true,
      }, undefined)
    : undefined;

export const sessionMiddleware = session({
    name: 'dgap_admin_session',
    secret,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: mysqlSessionStore,
    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 8,
    },
});
