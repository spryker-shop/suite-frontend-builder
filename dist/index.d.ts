import { find } from './finder';
import { compile } from './compiler';
import { Settings } from './settings';
import { Mode, register, get } from './registry';
import { ConfigFactoryConstructor } from './config-factory';
export declare function build(settings: Settings, mode: Mode): void;
export declare const util: {
    find: typeof find;
    compile: typeof compile;
    getWebpackConfig: (settings: Settings, mode: string) => any;
};
export declare const factory: {
    register: typeof register;
    get: typeof get;
    default: {
        Base: ConfigFactoryConstructor;
        Development: ConfigFactoryConstructor;
        DevelopmentWatch: ConfigFactoryConstructor;
        Production: ConfigFactoryConstructor;
    };
};
