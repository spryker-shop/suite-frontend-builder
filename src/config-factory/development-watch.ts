import { DefaultMode, register, get } from '../registry';
import { ConfigFactoryConstructor } from '../config-factory';

export default <ConfigFactoryConstructor>register(DefaultMode.DEVELOPMENT_WATCH, () => class extends get(DefaultMode.DEVELOPMENT) {
    create(): any {
        const config = super.create();

        return {
            ...config,
            watch: true
        };
    }
})
