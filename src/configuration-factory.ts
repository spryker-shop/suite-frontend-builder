import { Finder } from './finder';
import { Settings } from './settings';

export interface ConfigurationFactoryConstructor {
    new (Settings, Finder): ConfigurationFactory
}

export abstract class ConfigurationFactory {
    settings: Settings
    finder: Finder

    constructor(settings: Settings, finder: Finder) {
        this.settings = settings;
        this.finder = finder;

        console.log(`--> ${this.settings.name}`);
    }

    abstract createConfiguration(): any
}
