import { find } from './finder';
import { compile } from './compiler';
import { Settings } from './settings';
import { Mode, register, get } from './registry';
import { ConfigFactoryConstructor } from './config-factory';

import Base from './config-factory/base';
import Development from './config-factory/development';
import DevelopmentWatch from './config-factory/development-watch';
import Production from './config-factory/production';

function getWebpackConfig(settings: Settings, mode: Mode): any {
    const ConfigFactory = get(mode);
    const configFactory = new ConfigFactory(settings);
    return configFactory.create();
}

export function build(settings: Settings, mode: Mode): void {
    const config = getWebpackConfig(settings, mode);
    compile(config);
}

export const util = {
    find,
    compile,
    getWebpackConfig
}

export const factory = {
    register,
    get,

    default: {
        Base,
        Development,
        DevelopmentWatch,
        Production
    }
}
