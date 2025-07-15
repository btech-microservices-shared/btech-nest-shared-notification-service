"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigImplService = void 0;
const common_utils_1 = require("@arisale/common-utils");
const dotenv = require("dotenv");
const fs = require("fs");
const config_constants_1 = require("./config.constants");
const config_service_1 = require("./config.service");
class ConfigImplService extends config_service_1.ConfigService {
    envConfig = {};
    constructor(options) {
        super();
        if ((0, common_utils_1.isSet)(options.filePath) && fs.existsSync(options?.filePath)) {
            this.envConfig = dotenv.parse(fs.readFileSync(options.filePath));
        }
    }
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
    get(key, defaultValue) {
        return this.envConfig[key] ?? process.env[key] ?? defaultValue ?? null;
    }
    getAndCheck(key, defaultValue) {
        const value = this.get(key, defaultValue);
        if ((0, common_utils_1.isUnset)(value)) {
            throw new Error(`Missing environment variable: ${key}`);
        }
        return value;
    }
    getNumber(key, defaultValue) {
        let value = this.get(key);
        if ((0, common_utils_1.isSet)(value)) {
            let numberValue = Number(value);
            if (isNaN(numberValue)) {
                throw new Error(`value '${value}' is not a number`);
            }
            return numberValue;
        }
        return defaultValue;
    }
    getNumberAndCheck(key, defaultValue) {
        const value = this.getNumber(key, defaultValue);
        if ((0, common_utils_1.isUnset)(value)) {
            throw new Error(`Missing environment variable: ${key}`);
        }
        return value;
    }
    getBoolean(key, defaultValue) {
        let value = this.get(key);
        if (value) {
            switch (value.toLowerCase()) {
                case 'true':
                    return true;
                case 'false':
                    return false;
                default:
                    throw new Error(`value '${value}' is not a boolean`);
            }
        }
        return defaultValue;
    }
    getBooleanAndCheck(key, defaultValue) {
        const value = this.getBoolean(key, defaultValue);
        if ((0, common_utils_1.isUnset)(value)) {
            throw new Error(`Missing environment variable: ${key}`);
        }
        return value;
    }
}
exports.ConfigImplService = ConfigImplService;
//# sourceMappingURL=config-impl.service.js.map