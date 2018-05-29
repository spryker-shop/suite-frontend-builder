import * as webpack from 'webpack';
import * as autoprefixer from 'autoprefixer';
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { DefaultMode, register, get } from '../registry';
import { ConfigFactoryConstructor } from '../config-factory';

export default <ConfigFactoryConstructor>register(DefaultMode.PRODUCTION, () => class extends get(DefaultMode.DEVELOPMENT) {
    getGlobalVariables(): any {
        return {
            __NAME__: `'${this.settings.name}'`,
            __PRODUCTION__: true
        }
    }

    getPostcssLoaderOptions(): any {
        return {
            ident: 'postcss',
            plugins: [
                autoprefixer({
                    'browsers': ['> 1%', 'last 2 versions']
                })
            ]
        }
    }

    getUglifyJsPluginOptions(): any {
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
        }
    }

    getOptimizeCSSAssetsPluginOptions(): any {
        return {
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            }
        }
    }

    create(): any {
        const config = super.create();

        return {
            ...config,

            mode: 'production',
            devtool: false,

            optimization: {
                ...config.optimization,

                minimizer: [
                    new UglifyJsPlugin(this.getUglifyJsPluginOptions()),
                    new OptimizeCSSAssetsPlugin(this.getOptimizeCSSAssetsPluginOptions())
                ]
            }
        };
    }
})
