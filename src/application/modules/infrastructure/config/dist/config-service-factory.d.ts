import { ConfigService } from './config.service';
import { ConfigModuleOptions } from './interfaces/config-module-options.interface';
export declare class ConfigServiceFactory {
    static create(options?: ConfigModuleOptions): ConfigService;
}
