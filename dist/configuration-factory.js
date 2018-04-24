"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigurationFactory = (function () {
    function ConfigurationFactory(settings, finder) {
        this.settings = settings;
        this.finder = finder;
        console.log("--> " + this.settings.name);
    }
    return ConfigurationFactory;
}());
exports.ConfigurationFactory = ConfigurationFactory;
//# sourceMappingURL=configuration-factory.js.map