"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var autoprefixer = require("autoprefixer");
var UglifyJsPlugin = require("uglifyjs-webpack-plugin");
var OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
var development_1 = require("./development");
var ProductionConfigurationFactory = (function (_super) {
    __extends(ProductionConfigurationFactory, _super);
    function ProductionConfigurationFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProductionConfigurationFactory.prototype.getGlobalVariables = function () {
        return {
            __NAME__: "'" + this.settings.name + "'",
            __PRODUCTION__: true
        };
    };
    ProductionConfigurationFactory.prototype.getPostcssLoaderOptions = function () {
        return {
            ident: 'postcss',
            plugins: [
                autoprefixer({
                    'browsers': ['> 1%', 'last 2 versions']
                })
            ]
        };
    };
    ProductionConfigurationFactory.prototype.getUglifyJsPluginOptions = function () {
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
    };
    ProductionConfigurationFactory.prototype.getOptimizeCSSAssetsPluginOptions = function () {
        return {
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            }
        };
    };
    ProductionConfigurationFactory.prototype.createConfiguration = function () {
        var configuration = _super.prototype.createConfiguration.call(this);
        return __assign({}, configuration, { mode: 'production', devtool: false, optimization: __assign({}, configuration.optimization, { minimizer: [
                    new UglifyJsPlugin(this.getUglifyJsPluginOptions()),
                    new OptimizeCSSAssetsPlugin(this.getOptimizeCSSAssetsPluginOptions())
                ] }) });
    };
    return ProductionConfigurationFactory;
}(development_1.DevelopmentConfigurationFactory));
exports.ProductionConfigurationFactory = ProductionConfigurationFactory;
//# sourceMappingURL=production.js.map