import { join, dirname, basename } from 'path';
import * as webpack from 'webpack';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import { Settings } from '../settings';
import { Finder } from '../finder';
import { ConfigurationFactory } from '../configuration-factory';

export class DevelopmentConfigurationFactory extends ConfigurationFactory {
    tsConfigFile: string

    constructor(settings: Settings, finder: Finder) {
        super(settings, finder);

        this.tsConfigFile = join(this.settings.dirs.context, './tsconfig.json');
    }

    findComponentEntryPoints(): string[] {
        process.stdout.write('Scanning for component entry points... ');
        const files = this.finder.find(this.settings.find.componentEntryPoints);

        const entryPoints = <string[]>Object.values(files.reduce((map, file) => {
            const dir = dirname(file);
            const name = basename(dir);
            const type = basename(dirname(dir));
            map[`${type}/${name}`] = file;
            return map;
        }, {}));

        console.log(`${entryPoints.length} found`);
        return entryPoints;
    }

    findComponentStyles(): string[] {
        process.stdout.write('Scanning for component styles... ');
        const styles = this.finder.find(this.settings.find.componentStyles);
        console.log(`${styles.length} found`);
        return styles;
    }

    getShopModuleAliasesFromTsConfig(): any {
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
            const aliasDir = join(this.settings.dirs.context, aliasPath);
            map[alias] = aliasDir;
            return map;
        }, {});
    }

    getGlobalVariables(): any {
        return {
            __NAME__: `'${this.settings.name}'`,
            __PRODUCTION__: false
        }
    }

    getAppEntryPoint(): any {
        return [
            join(this.settings.dirs.ui.project, './app.ts'),
            join(this.settings.dirs.ui.project, './styles/basic.scss'),
            ...this.findComponentEntryPoints(),
            join(this.settings.dirs.ui.project, './styles/util.scss')
        ]
    }

    getVendorEntryPoint(): any {
        return [
            join(this.settings.dirs.ui.project, './vendor.ts')
        ]
    }

    getTSLoaderOptions(): any {
        return {
            context: this.settings.dirs.context,
            configFile: this.tsConfigFile,
            compilerOptions: {
                baseUrl: this.settings.dirs.context,
                outDir: this.settings.paths.public
            }
        }
    }

    getCssLoaderOptions(): any {
        return {
            importLoaders: 1
        }
    }

    getPostcssLoaderOptions(): any {
        return {
            ident: 'postcss',
            plugins: []
        }
    }

    getSassLoaderOptions(): any {
        return {}
    }

    getSassResourcesLoaderOptions(): any {
        return {
            resources: [
                join(this.settings.dirs.ui.project, './styles/shared.scss'),
                ...this.findComponentStyles()
            ]
        }
    }

    getMiniCssExtractPluginOptions(): any {
        return {
            filename: `./css/${this.settings.name}.[name].css`,
        }
    }

    getCleanWebpackPluginPaths(): any {
        return [
            'js',
            'css'
        ]
    }

    getCleanWebpackPluginOptions(): any {
        return {
            root: this.settings.dirs.public,
            verbose: true,
            beforeEmit: true
        }
    }

    createConfiguration(): any {
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
                filename: `./js/${this.settings.name}.[name].js`,
                publicPath: '/assets/',
                jsonpFunction: `webpackJsonp_${this.settings.name}`
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
        }
    }
}
