"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configServiceProvider = void 0;
const config_service_factory_1 = require("./config-service-factory");
const config_module_definition_1 = require("./config.module-definition");
const config_service_1 = require("./config.service");
exports.configServiceProvider = {
    provide: config_service_1.ConfigService,
    inject: [{ token: config_module_definition_1.MODULE_OPTIONS_TOKEN, optional: true }],
    useFactory: (options) => {
        return config_service_factory_1.ConfigServiceFactory.create(options);
    }
};
//# sourceMappingURL=config.providers.js.map