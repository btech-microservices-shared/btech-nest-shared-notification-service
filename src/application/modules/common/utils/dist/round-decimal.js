"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundDecimal = void 0;
function roundDecimal(value, decimalPlaces) {
    if (value === 0) {
        return value;
    }
    let roundedValue = Number(Math.round((value + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);
    if (isNaN(roundedValue)) {
        roundedValue = 0;
    }
    return roundedValue;
}
exports.roundDecimal = roundDecimal;
//# sourceMappingURL=round-decimal.js.map