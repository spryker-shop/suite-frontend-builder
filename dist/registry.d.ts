import { ConfigFactoryConstructor } from './config-factory';
export interface ConfigFactoryConstructorImporter {
    (): ConfigFactoryConstructor;
}
export declare enum DefaultMode {
    BASE = "base",
    DEVELOPMENT = "development",
    DEVELOPMENT_WATCH = "development-watch",
    PRODUCTION = "production"
}
export declare type Mode = DefaultMode | string;
export declare function register(mode: Mode, importer: ConfigFactoryConstructorImporter): ConfigFactoryConstructor;
export declare function get(mode: Mode): ConfigFactoryConstructor;
