import { Finder } from './finder';
import { Compiler } from './compiler';
import { Settings } from './settings';
import { ConfigurationFactoryConstructor } from './configuration-factory';

export function build(settings: Settings, ConfigurationFactory: ConfigurationFactoryConstructor) {
    const finder = new Finder();
    const configurationFactory = new ConfigurationFactory(settings, finder);
    const compiler = new Compiler(configurationFactory);

    compiler.run();
}
