"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const finder_1 = require("../finder");
const registry_1 = require("../registry");
exports.default = registry_1.register(registry_1.DefaultMode.DEVELOPMENT, () => class extends registry_1.get(registry_1.DefaultMode.BASE) {
    constructor(settings) {
        super(settings);
        this.tsConfigFile = path_1.join(this.settings.context, './tsconfig.json');
    }
    findComponentEntryPoints() {
        process.stdout.write('Scanning for component entry points...');
        const files = finder_1.find(this.settings.find.componentEntryPoints);
        const entryPoints = Object.values(files.reduce((map, file) => {
            const dir = path_1.dirname(file);
            const name = path_1.basename(dir);
            const type = path_1.basename(path_1.dirname(dir));
            map[`${type}/${name}`] = file;
            return map;
        }, {}));
        console.log(`${entryPoints.length} found`);
        return entryPoints;
    }
    findComponentStyles() {
        process.stdout.write('Scanning for component styles... ');
        const styles = finder_1.find(this.settings.find.componentStyles);
        console.log(`${styles.length} found`);
        return styles;
    }
    getShopModuleAliasesFromTsConfig() {
        const tsConfig = require(this.tsConfigFile);
        const tsConfigPaths = tsConfig.compilerOptions.paths;
        return Object.keys(tsConfigPaths).reduce((map, pathName) => {
            if (pathName === '*') {
                return map;
            }
            if (tsConfigPaths[pathName].length === 0) {
                return map;
            }
            const alias = pathName.replace(/(\/\*?)$/, '');
            const aliasPath = tsConfigPaths[pathName][0].replace(/(\/\*?)$/, '');
            const aliasDir = path_1.join(this.settings.context, aliasPath);
            map[alias] = aliasDir;
            return map;
        }, {});
    }
    getGlobalVariables() {
        return {
            __NAME__: `'${this.settings.name}'`,
            __PRODUCTION__: false
        };
    }
    getES6PolyfillEntryPoint() {
        return [
            path_1.join(this.settings.context, this.settings.paths.project.shopUiModule, './es6-polyfill.ts')
        ];
    }
    getVendorEntryPoint() {
        return [
            path_1.join(this.settings.context, this.settings.paths.project.shopUiModule, './vendor.ts')
        ];
    }
    getAppEntryPoint() {
        return [
            path_1.join(this.settings.context, this.settings.paths.project.shopUiModule, './app.ts'),
            path_1.join(this.settings.context, this.settings.paths.project.shopUiModule, './styles/basic.scss'),
            ...this.findComponentEntryPoints(),
            path_1.join(this.settings.context, this.settings.paths.project.shopUiModule, './styles/util.scss')
        ];
    }
    getTSLoaderOptions() {
        return {
            context: this.settings.context,
            configFile: this.tsConfigFile,
            compilerOptions: {
                baseUrl: this.settings.context,
                outDir: this.settings.paths.public
            }
        };
    }
    getCssLoaderOptions() {
        return {
            importLoaders: 1
        };
    }
    getPostcssLoaderOptions() {
        return {
            ident: 'postcss',
            plugins: []
        };
    }
    getSassLoaderOptions() {
        return {};
    }
    getSassResourcesLoaderOptions() {
        return {
            resources: [
                path_1.join(this.settings.context, this.settings.paths.project.shopUiModule, './styles/shared.scss'),
                ...this.findComponentStyles()
            ]
        };
    }
    getMiniCssExtractPluginOptions() {
        return {
            filename: `./css/${this.settings.name}.[name].css`,
        };
    }
    getCleanWebpackPluginPaths() {
        return [
            'js',
            'css'
        ];
    }
    getCleanWebpackPluginOptions() {
        return {
            root: path_1.join(this.settings.context, this.settings.paths.public),
            verbose: true,
            beforeEmit: true
        };
    }
    create() {
        const config = super.create();
        return Object.assign({}, config, { context: this.settings.context, mode: 'development', devtool: 'inline-source-map', stats: {
                colors: true,
                chunks: false,
                chunkModules: false,
                chunkOrigins: false,
                modules: false,
                entrypoints: false
            }, entry: {
                'es6-polyfill': this.getES6PolyfillEntryPoint(),
                'vendor': this.getVendorEntryPoint(),
                'app': this.getAppEntryPoint()
            }, output: {
                path: path_1.join(this.settings.context, this.settings.paths.public),
                filename: `./js/${this.settings.name}.[name].js`,
                publicPath: '/assets/',
                jsonpFunction: `webpackJsonp_${this.settings.name}`
            }, resolve: {
                extensions: ['.ts', '.js', '.json', '.css', '.scss'],
                alias: this.getShopModuleAliasesFromTsConfig()
            }, resolveLoader: {
                modules: [
                    'node_modules',
                    'node_modules/@spryker/suite-frontend-builder/node_modules'
                ]
            }, module: {
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
            }, optimization: {
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
            }, plugins: [
                new webpack.DefinePlugin(this.getGlobalVariables()),
                new CleanWebpackPlugin(this.getCleanWebpackPluginPaths(), this.getCleanWebpackPluginOptions()),
                new MiniCssExtractPlugin(this.getMiniCssExtractPluginOptions())
            ] });
    }
});
//# sourceMappingURL=development.js.map