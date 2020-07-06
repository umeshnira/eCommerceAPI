import 'reflect-metadata';
import { createConnection, ConnectionOptions } from 'typeorm';
import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import compression from 'compression';
import routes from './routes';
import settings from './config/app-settings.json';
import { EnvironmentType } from './config/enums/environment-type.enum';
import { application } from './config/app-settings.json';

createConnection(getDataBaseConnection()).then(() => {
    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(compression({ filter: shouldCompress }));
    app.use(express.static('public'));
    app.use(xss());

    app.use('/ecommerce', routes);
    const PORT = process.env.PORT || application.port;

    if (settings.application.environment === EnvironmentType[EnvironmentType.Local]) {
        const httpsServer = https.createServer({
            key: fs.readFileSync(path.resolve(__dirname, '../ssl/server.key')),
            cert: fs.readFileSync(path.resolve(__dirname, '../ssl/server.crt'))
        }, app);
        httpsServer.listen(PORT, function () {
            console.log(`Server started on https port ${PORT}!`);
        })
    } else {
        const httpServer = http.createServer(app);
        httpServer.listen(PORT, () => {
            console.log(`Server started on http port ${PORT}!`);
        });
    }

}).catch(error => console.log(error));

function getDataBaseConnection(): ConnectionOptions {
    return {
        type: 'mysql',
        host: settings.database.host,
        port: settings.database.port,
        username: settings.database.username,
        password: settings.database.password,
        database: settings.database.database,
        synchronize: settings.database.synchronize,
        logging: settings.database.logging,
        // ssl: { ca: fs.readFileSync(path.resolve(__dirname, settings.database.sslCertifciate)).toString() },
        entities: settings.database.entities,
        migrations: settings.database.migrations,
        subscribers: settings.database.subscribers,
        cli: settings.database.cli
    }
}

function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        return false
    }

    return compression.filter(req, res)
}
