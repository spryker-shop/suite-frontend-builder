import { Settings } from './settings';

export interface ConfigFactory {
    readonly settings: Settings
    create(): any
}

export interface ConfigFactoryConstructor {
    new(Settings): ConfigFactory
}
