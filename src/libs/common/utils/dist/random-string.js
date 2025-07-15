"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = void 0;
function randomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
exports.randomString = randomString;
//# sourceMappingURL=random-string.js.map