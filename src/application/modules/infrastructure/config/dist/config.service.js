"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const config_constants_1 = require("./config.constants");
class ConfigService {
    get isDev() {
        return config_constants_1.ENVIRONMENT === 'development';
    }
    get isProd() {
        return config_constants_1.ENVIRONMENT === 'production';
    }
    get environment() {
        return config_constants_1.ENVIRONMENT;
    }
    get environmentLowerCase() {
        return config_constants_1.ENVIRONMENT?.toLowerCase() ?? '';
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map