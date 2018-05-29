"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("../registry");
exports.default = registry_1.register(registry_1.DefaultMode.DEVELOPMENT_WATCH, () => class extends registry_1.get(registry_1.DefaultMode.DEVELOPMENT) {
    create() {
        const config = super.create();
        return Object.assign({}, config, { watch: true });
    }
});
//# sourceMappingURL=development-watch.js.map