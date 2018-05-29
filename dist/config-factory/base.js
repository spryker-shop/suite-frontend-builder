"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("../registry");
exports.default = registry_1.register(registry_1.DefaultMode.BASE, () => class {
    constructor(settings) {
        this.settings = settings;
        console.log(`--> ${this.settings.name}`);
    }
    create() {
        return {};
    }
});
//# sourceMappingURL=base.js.map