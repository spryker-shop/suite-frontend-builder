import { Settings } from '../settings';
import { DefaultMode, register } from '../registry';
import { ConfigFactory, ConfigFactoryConstructor } from '../config-factory';

export default <ConfigFactoryConstructor>register(DefaultMode.BASE, () => class implements ConfigFactory {
    readonly settings: Settings

    constructor(settings: Settings) {
        this.settings = settings;
        console.log(`--> ${this.settings.name}`);
    }

    create(): any {
        return {}
    }
})
