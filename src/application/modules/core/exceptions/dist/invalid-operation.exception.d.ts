import { BaseException } from './base.exception';
export declare class InvalidOperationException extends BaseException {
    readonly code?: number;
    readonly data?: Record<string, any>;
    constructor(message?: string, code?: number, data?: Record<string, any>);
}
