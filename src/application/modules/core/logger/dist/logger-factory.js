"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerFactory = void 0;
const common_utils_1 = require("@arisale/common-utils");
let loggerCtor = undefined;
class LoggerFactory {
    static logLevels = undefined;
    static setLogLevels(levels) {
        this.logLevels = levels;
    }
    static setLoggerClass(loggerClass) {
        loggerCtor = loggerClass;
    }
    static create(context) {
        if ((0, common_utils_1.isFunction)(context) && context instanceof Function) {
            context = context.name;
        }
        const logger = new loggerCtor(context);
        if ((0, common_utils_1.isSet)(this.logLevels)) {
            logger.setLogLevels(this.logLevels);
        }
        return logger;
    }
}
exports.LoggerFactory = LoggerFactory;
//# sourceMappingURL=logger-factory.js.map