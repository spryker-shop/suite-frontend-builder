"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webpack = require("webpack");
var Compiler = (function () {
    function Compiler(factory) {
        this.configuration = factory.createConfiguration();
    }
    Compiler.prototype.run = function () {
        var _this = this;
        console.log("Building for " + this.configuration.mode + "...");
        if (this.configuration.watch) {
            console.log('Watch mode: ON');
        }
        webpack(this.configuration, function (err, stats) {
            if (err) {
                console.error(err.stack || err);
                if (err.details) {
                    console.error(err.details);
                }
                return;
            }
            console.log(stats.toString(_this.configuration.stats), '\n');
        });
    };
    return Compiler;
}());
exports.Compiler = Compiler;
//# sourceMappingURL=compiler.js.map