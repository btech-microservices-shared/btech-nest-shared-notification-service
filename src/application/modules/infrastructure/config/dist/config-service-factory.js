"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigServiceFactory = void 0;
const config_impl_service_1 = require("./config-impl.service");
const config_constants_1 = require("./config.constants");
class ConfigServiceFactory {
    static create(options) {
        return new config_impl_service_1.ConfigImplService(options ?? { filePath: config_constants_1.DEFAULT_FILE_PATH });
    }
}
exports.ConfigServiceFactory = ConfigServiceFactory;
//# sourceMappingURL=config-service-factory.js.map