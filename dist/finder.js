"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fast_glob_1 = require("fast-glob");
const defaultGlobSettings = {
    followSymlinkedDirectories: false,
    absolute: true,
    onlyFiles: true,
    onlyDirectories: false
};
function find(settings) {
    const globSettings = Object.assign({}, defaultGlobSettings, settings.globSettings || {});
    return settings.dirs.reduce((results, dir) => [
        ...results,
        ...fast_glob_1.sync(settings.patterns, Object.assign({}, globSettings, { cwd: dir }))
    ], []);
}
exports.find = find;
//# sourceMappingURL=finder.js.map