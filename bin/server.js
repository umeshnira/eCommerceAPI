"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const compression_1 = __importDefault(require("compression"));
const routes_1 = __importDefault(require("./routes"));
const app_settings_json_1 = __importDefault(require("./config/app-settings.json"));
const environment_type_enum_1 = require("./config/enums/environment-type.enum");
typeorm_1.createConnection(getDataBaseConnection()).then(() => {
    const app = express_1.default();
    app.use(cors_1.default());
    app.use(helmet_1.default());
    app.use(express_1.default.json());
    app.use(compression_1.default({ filter: shouldCompress }));
    app.use(xss_clean_1.default());
    app.use('/ecommerce', routes_1.default);
    app.get('/ecommerce/helloworld', function (req, res) {
        res.send('helloworld');
    });
    const PORT = process.env.PORT || 1337;
    if (app_settings_json_1.default.application.environment === environment_type_enum_1.EnvironmentType[environment_type_enum_1.EnvironmentType.Local]) {
        const httpsServer = https_1.default.createServer({
            key: fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../ssl/server.key')),
            cert: fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../ssl/server.cert'))
        }, app);
        httpsServer.listen(PORT, function () {
            console.log(`Server started on https port ${PORT}!`);
        });
    }
    else {
        const httpServer = http_1.default.createServer(app);
        httpServer.listen(PORT, () => {
            console.log(`Server started on http port ${PORT}!`);
        });
    }
}).catch(error => console.log(error));
function getDataBaseConnection() {
    return {
        type: "mysql",
        host: app_settings_json_1.default.database.host,
        port: app_settings_json_1.default.database.port,
        username: app_settings_json_1.default.database.username,
        password: app_settings_json_1.default.database.password,
        database: app_settings_json_1.default.database.database,
        synchronize: app_settings_json_1.default.database.synchronize,
        logging: app_settings_json_1.default.database.logging,
        // ssl: { ca: fs.readFileSync(path.resolve(__dirname, settings.database.sslCertifciate)).toString() },
        entities: app_settings_json_1.default.database.entities,
        migrations: app_settings_json_1.default.database.migrations,
        subscribers: app_settings_json_1.default.database.subscribers,
        cli: app_settings_json_1.default.database.cli
    };
}
function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        return false;
    }
    return compression_1.default.filter(req, res);
}
//# sourceMappingURL=server.js.map