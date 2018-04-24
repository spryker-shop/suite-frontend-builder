import { DevelopmentConfigurationFactory } from './development';

export class DevelopmentWatchConfigurationFactory extends DevelopmentConfigurationFactory {
    createConfiguration(): any {
        const configuration = super.createConfiguration();

        return {
            ...configuration,

            watch: true
        };
    }
}
