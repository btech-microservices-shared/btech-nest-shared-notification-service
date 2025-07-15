export declare abstract class ConfigService {
    get isDev(): boolean;
    get isProd(): boolean;
    get environment(): string;
    get environmentLowerCase(): string;
    abstract get(key: string, defaultValue?: string): string;
    abstract getAndCheck(key: string, defaultValue?: string): string;
    abstract getNumber(key: string, defaultValue?: number): number;
    abstract getNumberAndCheck(key: string, defaultValue?: number): number;
    abstract getBoolean(key: string, defaultValue?: boolean): boolean;
    abstract getBooleanAndCheck(key: string, defaultValue?: boolean): boolean;
}
