"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autoprefixer = require("autoprefixer");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const registry_1 = require("../registry");
exports.default = registry_1.register(registry_1.DefaultMode.PRODUCTION, () => class extends registry_1.get(registry_1.DefaultMode.DEVELOPMENT) {
    getGlobalVariables() {
        return {
            __NAME__: `'${this.settings.name}'`,
            __PRODUCTION__: true
        };
    }
    getPostcssLoaderOptions() {
        return {
            ident: 'postcss',
            plugins: [
                autoprefixer({
                    'browsers': ['> 1%', 'last 2 versions']
                })
            ]
        };
    }
    getUglifyJsPluginOptions() {
        return {
            cache: true,
            parallel: true,
            sourceMap: false,
            uglifyOptions: {
                output: {
                    comments: false,
                    beautify: false
                }
            }
        };
    }
    getOptimizeCSSAssetsPluginOptions() {
        return {
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            }
        };
    }
    create() {
        const config = super.create();
        return Object.assign({}, config, { mode: 'production', devtool: false, optimization: Object.assign({}, config.optimization, { minimizer: [
                    new UglifyJsPlugin(this.getUglifyJsPluginOptions()),
                    new OptimizeCSSAssetsPlugin(this.getOptimizeCSSAssetsPluginOptions())
                ] }) });
    }
});
//# sourceMappingURL=production.js.map