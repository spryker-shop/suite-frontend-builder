"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fast_glob_1 = require("fast-glob");
var Finder = (function () {
    function Finder() {
    }
    Finder.prototype.find = function (settings) {
        var globSettings = __assign({ followSymlinkedDirectories: false, absolute: true, onlyFiles: true, onlyDirectories: false }, settings.globSettings || {});
        return settings.dirs.reduce(function (results, dir) { return results.concat(fast_glob_1.sync(settings.patterns, __assign({}, globSettings, { cwd: dir }))); }, []);
    };
    return Finder;
}());
exports.Finder = Finder;
//# sourceMappingURL=finder.js.map