"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidOperationException = void 0;
const base_exception_1 = require("./base.exception");
class InvalidOperationException extends base_exception_1.BaseException {
    code;
    data;
    constructor(message, code, data) {
        super(message);
        this.code = code;
        this.data = data;
    }
}
exports.InvalidOperationException = InvalidOperationException;
//# sourceMappingURL=invalid-operation.exception.js.map