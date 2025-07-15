"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_FILE_PATH = exports.ENVIRONMENT = exports.CONFIG_SERVICE_PROVIDER = void 0;
exports.CONFIG_SERVICE_PROVIDER = 'ConfigService';
exports.ENVIRONMENT = process.env.NODE_ENV ?? 'development';
exports.DEFAULT_FILE_PATH = `${process.cwd()}/environments/${exports.ENVIRONMENT}.env`;
//# sourceMappingURL=config.constants.js.map