export const isFunction = (obj: unknown) => typeof obj === 'function'
export const isNumber = (obj: unknown) => typeof obj === 'number'
export const isBoolean = (obj: unknown) => typeof obj === 'boolean'
export const isString = (obj: unknown) => typeof obj === 'string'
export const isUndefined = (obj: unknown) => typeof obj === 'undefined'
export const isObject = (obj: unknown) => typeof obj === 'object'
export const isDefined = (obj: unknown) => !isUndefined(obj)
export const isNull = (obj: unknown) => obj === null
export const isUnset = (obj: unknown) => isUndefined(obj) || isNull(obj)
export const isSet = (obj: unknown) => !isUndefined(obj) && !isNull(obj)
