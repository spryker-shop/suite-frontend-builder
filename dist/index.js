"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var finder_1 = require("./finder");
var compiler_1 = require("./compiler");
function build(settings, ConfigurationFactory) {
    var finder = new finder_1.Finder();
    var configurationFactory = new ConfigurationFactory(settings, finder);
    var compiler = new compiler_1.Compiler(configurationFactory);
    compiler.run();
}
exports.build = build;
//# sourceMappingURL=index.js.map