# Spryker Suite Frontend Builder

This tool is needed to build the frontend for **Spryker Suite** projects.
It's based on `webpack` 4, `sass` and `typescript`.

## Requirements

- `nodejs` >= 8.9
- `npm` >= 5.6

## Setup

Add this as a dev dependency in your `package.json`:

```bash
npm install --save-dev @spryker/suite-frontend-builder
```

#### 1. Add project folder

Create/update the folder `./src/Pyz/Yves/ShopUi/Theme/default` by adding these files:

```ts
// app.ts

import { bootstrap } from 'ShopUi/app';
bootstrap();
```

```ts
// vendor.ts

// add webcomponents polyfill
import '@webcomponents/webcomponentsjs/webcomponents-bundle';
```

```ts
// es6-polyfill.ts

// add es6 polyfill
import 'core-js/fn/promise';
import 'core-js/fn/array';
import 'core-js/fn/set';
import 'core-js/fn/map';

// check if the browser natively supports webcomponents (and es6)
const hasNativeCustomElements = !!window.customElements;

// then load a shim for es5 transpilers (typescript or babel)
// https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs
if (hasNativeCustomElements) {
    import(/* webpackMode: "eager" */'@webcomponents/webcomponentsjs/custom-elements-es5-adapter');
}
```

Create/update the folder `./src/Pyz/Yves/ShopUi/Theme/default/styles` by adding these files:

```scss
// basic.scss

@import '~ShopUi/styles/basic';

@include basic-reset;
@include basic-typography;
@include basic-grid;
@include basic-animation;
```

```scss
// shared.scss

@import '~ShopUi/styles/shared';
```

```scss
// util.scss

@import '~ShopUi/styles/util';

@include util-spacing;
@include util-text;
@include util-float;
@include util-visibility;
```

#### 2. Add build folder

Create a folder `./frontend` and add these files:

```js
// settings.js
// definition: https://github.com/spryker-shop/suite-frontend-builder/blob/master/src/settings.ts

const path = require('path');

// define the applicatin name
// important: the name must be normalized
const name = 'yves_default';

// define the current theme
const theme = 'default';

// define the current context (root)
const context = process.cwd();

// define project relative paths to context
const paths = {
    // public folder
    public: './public/Yves/assets',

    // core folders
    core: {
        // all modules
        modules: './vendor/spryker-shop',
        // ShopUi source folder
        shopUiModule: `./vendor/spryker-shop/shop-ui/src/SprykerShop/Yves/ShopUi/Theme/${theme}`
    },

    // project folders
    project: {
        // all modules
        modules: './src/Pyz/Yves',
        // ShopUi source folder
        shopUiModule: `./src/Pyz/Yves/ShopUi/Theme/${theme}`
    }
};

// export settings
module.exports = {
    name,
    theme,
    context,
    paths,

    // define settings for suite-frontend-builder finder
    find: {
        // webpack entry points (components) finder settings
        componentEntryPoints: {
            // absolute dirs in which look for
            dirs: [
                path.join(context, paths.core.modules),
                path.join(context, paths.project.modules)
            ],
            // files/dirs patterns
            patterns: [
                `**/Theme/${theme}/components/atoms/*/index.ts`,
                `**/Theme/${theme}/components/molecules/*/index.ts`,
                `**/Theme/${theme}/components/organisms/*/index.ts`,
                `**/Theme/${theme}/templates/*/index.ts`,
                `**/Theme/${theme}/views/*/index.ts`,
                '!config',
                '!data',
                '!deploy',
                '!node_modules',
                '!public',
                '!test'
            ]
        },

        // core component styles finder settings
        // important: this part is used in shared scss environment
        // do not change unless necessary
        componentStyles: {
            // absolute dirs in which look for
            dirs: [
                path.join(context, paths.core.modules)
            ],
            // files/dirs patterns
            patterns: [
                `**/Theme/${theme}/components/atoms/*/*.scss`,
                `**/Theme/${theme}/components/molecules/*/*.scss`,
                `**/Theme/${theme}/components/organisms/*/*.scss`,
                `**/Theme/${theme}/templates/*/*.scss`,
                `**/Theme/${theme}/views/*/*.scss`,
                `!**/Theme/${theme}/**/style.scss`,
                '!config',
                '!data',
                '!deploy',
                '!node_modules',
                '!public',
                '!test'
            ]
        }
    }
}
```

```js
// build.js

// require suite-frontend-builder
const builder = require('@spryker/suite-frontend-builder');

// require project settings
const settings = require('./settings');

// get the mode arg from `npm run xxx` script
// defined in package.json
const [mode] = process.argv.slice(2);

// register custom development configuration factory
require('./config/development');

// build the project using the configuration factory
// associated with the provided mode
builder.build(settings, mode);
```

#### 3. Update `package.json`

Update your `package.json` script section adding the following:

```json
"scripts": {
    "yves": "node ./frontend/build development",
    "yves:watch": "node ./frontend/build development-watch",
    "yves:production": "node ./frontend/build production",
    ...
}
```

#### 4. Update `tsconfig.json`

Update your `tsconfig.json` file as following:

```json
{
    "extends": "./node_modules/@spryker/suite-frontend-builder/tsconfig.suite",
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "*": [
                "*"
            ],
            "ShopUi/*": [
                "./vendor/spryker-shop/shop-ui/src/SprykerShop/Yves/ShopUi/Theme/default/*"
            ]
        }
    },
    "files": [
        "./src/Pyz/Yves/ShopUi/Theme/default/app.ts",
        "./src/Pyz/Yves/ShopUi/Theme/default/vendor.ts",
        "./src/Pyz/Yves/ShopUi/Theme/default/es6-polyfill.ts"
    ],
    "include": [
        "./vendor/spryker-shop/**/*",
        "./src/Pyz/Yves/**/*"
    ],
    "exclude": [
        "node_modules",
        "**/*.spec.ts"
    ]
}
```

`tsconfig.json` is now extending the basic configuration provided by `@spryker/suite-frontend-builder` and pointing to project `src`
folder for entry points.

## Extend webpack config

This tool offers 4 configurations:
- **base**: empty
- **development**: extends *base*;
- **development-watch** extends *development* and add watchers;
- **production**: extends *development* and change setting to optimise the build/output.

Might happen that you need more from webpack.
Here an example on how to extend one of the configurations.

#### Adding `copy-webpack-plugin` to the development configuration

Add your dep to `package.json`:

```json
"devDependencies": {
    "@spryker/suite-frontend-builder": "^0.3.0",
    "copy-webpack-plugin": "~4.5.1",
    ...
}
```

Create the folder `./frontend/config` and add this file:

```js
// custom development config factory

const path = require('path');
const builder = require('@spryker/suite-frontend-builder');

// this custom config factory implements a basic asset management strategy using copy-webpack-plugin
// modify this file to change and/or remove it
const CopyWebpackPlugin = require('copy-webpack-plugin');

// builder.factory.register associate a mode (development) to a specific config factory
// by extending the default config factory and assigning it to development mode
// your changes are going to be applied in all modes that relies on development one
// i.e. development-watch and production
builder.factory.register('development', () => class extends builder.factory.default.Development {
    getCleanWebpackPluginPaths() {
        const paths = super.getCleanWebpackPluginPaths();

        return [
            ...paths,
            'images',
            'fonts'
        ]
    }

    getCopyWebpackPluginPatterns() {
        return [
            {
                from: './frontend/assets/images/*',
                to: './images/[name].[ext]',
                ignore: ['*.gitkeep']
            }, {
                from: './frontend/assets/fonts/*',
                to: './fonts/[name].[ext]',
                ignore: ['*.gitkeep']
            }
        ]
    }

    getCopyWebpackPluginOptions() {
        return {
            context: this.settings.context
        }
    }

    create() {
        const config = super.create();

        return {
            ...config,
            // extend your webpack configuration here

            plugins: [
                ...config.plugins,
                new CopyWebpackPlugin(this.getCopyWebpackPluginPatterns(), this.getCopyWebpackPluginOptions())
            ]
        }
    }
})
```
