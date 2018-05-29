"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const finder_1 = require("./finder");
const compiler_1 = require("./compiler");
const registry_1 = require("./registry");
const base_1 = require("./config-factory/base");
const development_1 = require("./config-factory/development");
const development_watch_1 = require("./config-factory/development-watch");
const production_1 = require("./config-factory/production");
function getWebpackConfig(settings, mode) {
    const ConfigFactory = registry_1.get(mode);
    const configFactory = new ConfigFactory(settings);
    return configFactory.create();
}
function build(settings, mode) {
    const config = getWebpackConfig(settings, mode);
    compiler_1.compile(config);
}
exports.build = build;
exports.util = {
    find: finder_1.find,
    compile: compiler_1.compile,
    getWebpackConfig
};
exports.factory = {
    register: registry_1.register,
    get: registry_1.get,
    default: {
        Base: base_1.default,
        Development: development_1.default,
        DevelopmentWatch: development_watch_1.default,
        Production: production_1.default
    }
};
//# sourceMappingURL=index.js.map