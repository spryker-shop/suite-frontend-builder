"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultMode;
(function (DefaultMode) {
    DefaultMode["BASE"] = "base";
    DefaultMode["DEVELOPMENT"] = "development";
    DefaultMode["DEVELOPMENT_WATCH"] = "development-watch";
    DefaultMode["PRODUCTION"] = "production";
})(DefaultMode = exports.DefaultMode || (exports.DefaultMode = {}));
const registry = new Map();
function register(mode, importer) {
    registry.set(mode, importer);
    return importer();
}
exports.register = register;
function get(mode) {
    if (!registry.has(mode)) {
        throw new Error(`Provider error: '${mode}' configuration does not exist`);
    }
    const importer = registry.get(mode);
    return importer();
}
exports.get = get;
//# sourceMappingURL=registry.js.map