import * as webpack from 'webpack';
import { ConfigurationFactory } from './configuration-factory';

export class Compiler {
    configuration: any

    constructor(factory: ConfigurationFactory) {
        this.configuration = factory.createConfiguration();
    }

    run() {
        console.log(`Building for ${this.configuration.mode}...`);

        if (this.configuration.watch) {
            console.log('Watch mode: ON');
        }

        webpack(this.configuration, (err, stats) => {
            if (err) {
                console.error(err.stack || err);

                if (err.details) {
                    console.error(err.details);
                }

                return;
            }

            console.log(stats.toString(this.configuration.stats), '\n');
        });
    }
}
