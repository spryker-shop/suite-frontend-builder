import { ConfigFactoryConstructor } from './config-factory';
import { Settings } from './settings';

export interface ConfigFactoryConstructorImporter {
    (): ConfigFactoryConstructor
}

export enum DefaultMode {
    BASE = 'base',
    DEVELOPMENT = 'development',
    DEVELOPMENT_WATCH = 'development-watch',
    PRODUCTION = 'production'
}

export type Mode = DefaultMode | string

const registry = new Map<string, ConfigFactoryConstructorImporter>();

export function register(mode: Mode, importer: ConfigFactoryConstructorImporter): ConfigFactoryConstructor {
    registry.set(mode, importer);
    return importer();
}

export function get(mode: Mode): ConfigFactoryConstructor {
    if (!registry.has(mode)) {
        throw new Error(`Provider error: '${mode}' configuration does not exist`);
    }

    const importer = registry.get(mode);
    return importer();
}
