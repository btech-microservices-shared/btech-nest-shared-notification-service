import { ConfigService } from './config.service';
import { ConfigModuleOptions } from './interfaces/config-module-options.interface';
export declare class ConfigImplService extends ConfigService {
    private readonly envConfig;
    constructor(options?: ConfigModuleOptions);
    get isDev(): boolean;
    get isProd(): boolean;
    get environment(): string;
    get environmentLowerCase(): string;
    get(key: string, defaultValue?: string): string;
    getAndCheck(key: string, defaultValue?: string): string;
    getNumber(key: string, defaultValue?: number): number;
    getNumberAndCheck(key: string, defaultValue?: number): number;
    getBoolean(key: string, defaultValue?: boolean): boolean;
    getBooleanAndCheck(key: string, defaultValue?: boolean): boolean;
}
