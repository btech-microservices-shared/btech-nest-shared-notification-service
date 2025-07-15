import { LoggerService, LoggerServiceConstructor } from './logger-service';
export declare class LoggerFactory {
    private static logLevels;
    static setLogLevels(levels: unknown): void;
    static setLoggerClass(loggerClass: LoggerServiceConstructor): void;
    static create(context: string | Function): LoggerService;
}
