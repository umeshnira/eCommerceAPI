import { createPool, Pool } from 'mysql2/promise'
import config from '../config/app-settings.json';

export async function connect(): Promise<Pool> {
    const connection = await createPool({
        host: config.database.host,
        user: config.database.username,
        password: config.database.password,
        database: config.database.database,
        waitForConnections: config.database.waitForConnections,
        queueLimit: config.database.queueLimit,
        decimalNumbers: config.database.decimalNumbers,
        namedPlaceholders: config.database.namedPlaceholders
    });
    return connection;
}

export async function transaction(pool, callback) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        await callback(connection);
        await connection.commit();

    } catch (err) {

        await connection.rollback();
        throw err;

    } finally {
        connection.release();
    }
}