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
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var webpack = require("webpack");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var CleanWebpackPlugin = require("clean-webpack-plugin");
var configuration_factory_1 = require("../configuration-factory");
var DevelopmentConfigurationFactory = (function (_super) {
    __extends(DevelopmentConfigurationFactory, _super);
    function DevelopmentConfigurationFactory(settings, finder) {
        var _this = _super.call(this, settings, finder) || this;
        _this.defineFiles();
        return _this;
    }
    DevelopmentConfigurationFactory.prototype.defineFiles = function () {
        this.tsConfigFile = path_1.join(this.settings.dirs.context, './tsconfig.json');
        this.mainEntryPointFile = path_1.join(this.settings.dirs.ui.project, './app.ts');
        this.vendorEntryPointFile = path_1.join(this.settings.dirs.ui.project, './vendor.ts');
        this.basicStyleFile = path_1.join(this.settings.dirs.ui.project, './styles/basics.scss');
        this.utilStyleFile = path_1.join(this.settings.dirs.ui.project, './styles/utils.scss');
        this.sharedStyleFile = path_1.join(this.settings.dirs.ui.project, './styles/shared.scss');
    };
    DevelopmentConfigurationFactory.prototype.findComponentEntryPoints = function () {
        process.stdout.write('Scanning for component entry points... ');
        var files = this.finder.find(this.settings.find.componentEntryPoints);
        var entryPoints = Object.values(files.reduce(function (map, file) {
            var dir = path_1.dirname(file);
            var name = path_1.basename(dir);
            var type = path_1.basename(path_1.dirname(dir));
            map[type + "/" + name] = file;
            return map;
        }, {}));
        console.log(entryPoints.length + " found");
        return entryPoints;
    };
    DevelopmentConfigurationFactory.prototype.findComponentStyles = function () {
        process.stdout.write('Scanning for component styles... ');
        var styles = this.finder.find(this.settings.find.componentStyles);
        console.log(styles.length + " found");
        return styles;
    };
    DevelopmentConfigurationFactory.prototype.getShopModuleAliasesFromTsConfig = function () {
        var _this = this;
        var tsConfig = require(this.tsConfigFile);
        var tsConfigPaths = tsConfig.compilerOptions.paths;
        return Object.keys(tsConfigPaths).reduce(function (map, pathName) {
            if (pathName === '*') {
                return map;
            }
            if (tsConfigPaths[pathName].length === 0) {
                return map;
            }
            var alias = pathName.replace(/(\/\*?)$/, '');
            var aliasPath = tsConfigPaths[pathName][0].replace(/(\/\*?)$/, '');
            var aliasDir = path_1.join(_this.settings.dirs.context, aliasPath);
            map[alias] = aliasDir;
            return map;
        }, {});
    };
    DevelopmentConfigurationFactory.prototype.getGlobalVariables = function () {
        return {
            __NAME__: "'" + this.settings.name + "'",
            __PRODUCTION__: false
        };
    };
    DevelopmentConfigurationFactory.prototype.getAppEntryPoint = function () {
        return [
            this.mainEntryPointFile,
            this.basicStyleFile
        ].concat(this.findComponentEntryPoints(), [
            this.utilStyleFile
        ]);
    };
    DevelopmentConfigurationFactory.prototype.getVendorEntryPoint = function () {
        return [
            this.vendorEntryPointFile
        ];
    };
    DevelopmentConfigurationFactory.prototype.getTSLoaderOptions = function () {
        return {
            context: this.settings.dirs.context,
            configFile: this.tsConfigFile,
            compilerOptions: {
                baseUrl: this.settings.dirs.context,
                outDir: this.settings.paths.public
            }
        };
    };
    DevelopmentConfigurationFactory.prototype.getCssLoaderOptions = function () {
        return {
            importLoaders: 1
        };
    };
    DevelopmentConfigurationFactory.prototype.getPostcssLoaderOptions = function () {
        return {
            ident: 'postcss',
            plugins: []
        };
    };
    DevelopmentConfigurationFactory.prototype.getSassLoaderOptions = function () {
        return {};
    };
    DevelopmentConfigurationFactory.prototype.getSassResourcesLoaderOptions = function () {
        return {
            resources: [
                this.sharedStyleFile
            ].concat(this.findComponentStyles())
        };
    };
    DevelopmentConfigurationFactory.prototype.getMiniCssExtractPluginOptions = function () {
        return {
            filename: "./css/" + this.settings.name + ".[name].css",
        };
    };
    DevelopmentConfigurationFactory.prototype.getCleanWebpackPluginPaths = function () {
        return [
            'js',
            'css'
        ];
    };
    DevelopmentConfigurationFactory.prototype.getCleanWebpackPluginOptions = function () {
        return {
            root: this.settings.dirs.public,
            verbose: true,
            beforeEmit: true
        };
    };
    DevelopmentConfigurationFactory.prototype.createConfiguration = function () {
        return {
            context: this.settings.dirs.context,
            mode: 'development',
            devtool: 'inline-source-map',
            stats: {
                colors: true,
                chunks: false,
                chunkModules: false,
                chunkOrigins: false,
                modules: false,
                entrypoints: false
            },
            entry: {
                app: this.getAppEntryPoint(),
                vendor: this.getVendorEntryPoint()
            },
            output: {
                path: this.settings.dirs.public,
                filename: "./js/" + this.settings.name + ".[name].js",
                publicPath: '/assets/',
                jsonpFunction: "webpackJsonp_" + this.settings.name
            },
            resolve: {
                extensions: ['.ts', '.js', '.json', '.css', '.scss'],
                alias: this.getShopModuleAliasesFromTsConfig()
            },
            resolveLoader: {
                modules: [
                    'node_modules',
                    'node_modules/@spryker/shop-ui-builder/node_modules'
                ]
            },
            module: {
                rules: [
                    { test: /\.ts$/, loader: 'ts-loader', options: this.getTSLoaderOptions() },
                    {
                        test: /\.scss/i,
                        use: [
                            MiniCssExtractPlugin.loader,
                            { loader: 'css-loader', options: this.getCssLoaderOptions() },
                            { loader: 'postcss-loader', options: this.getPostcssLoaderOptions() },
                            { loader: 'sass-loader', options: this.getSassLoaderOptions() },
                            { loader: 'sass-resources-loader', options: this.getSassResourcesLoaderOptions() }
                        ]
                    }
                ]
            },
            optimization: {
                runtimeChunk: 'single',
                concatenateModules: false,
                splitChunks: {
                    chunks: 'initial',
                    minChunks: 1,
                    cacheGroups: {
                        default: false,
                        vendors: false
                    }
                }
            },
            plugins: [
                new webpack.DefinePlugin(this.getGlobalVariables()),
                new CleanWebpackPlugin(this.getCleanWebpackPluginPaths(), this.getCleanWebpackPluginOptions()),
                new MiniCssExtractPlugin(this.getMiniCssExtractPluginOptions())
            ]
        };
    };
    return DevelopmentConfigurationFactory;
}(configuration_factory_1.ConfigurationFactory));
exports.DevelopmentConfigurationFactory = DevelopmentConfigurationFactory;
//# sourceMappingURL=development.js.map