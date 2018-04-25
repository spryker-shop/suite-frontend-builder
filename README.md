# Spryker Suite Frontend Builder

This tool is needed to build the frontend for **Spryker Suite** projects.
It's based on `webpack` 4, `sass` and `typescript`.

### Requirements

- `nodejs` >= 8.9
- `npm` >= 5.6

### Install

Add this as a dev dependency in your `package.json`:

```bash
npm install --save-dev @spryker/suite-frontend-builder
```

### Usage in Spryker Suite

#### 1. Add project folder

Create/update the folder `./src/Pyz/Yves/ShopUi/Theme/default` by adding these files:

- `./app.ts`
```js
import bootstrap from 'ShopUi/app/bootstrap';
import config from 'ShopUi/app/config';
bootstrap(config);
```

- `./vendor.ts`
```js
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import '@webcomponents/webcomponentsjs/webcomponents-sd-ce';
```

- `./styles/basic.scss`
```scss
@import '~ShopUi/styles/basic';
@include basic-reset;
@include basic-typography;
@include basic-grid;
@include basic-animation;
```

- `./styles/shared.scss`
```scss
@import '~ShopUi/styles/shared';
```

- `./styles/util.scss`
```scss
@import '~ShopUi/styles/util';
@include util-text;
@include util-float;
@include util-visibility;
```

#### 2. Add build folder

Create a folder `./frontend` and add these files:

- `./settings.js` (definition: https://github.com/spryker-shop/suite-frontend-builder/blob/master/src/settings.ts#L16)
```js
const path = require('path');

const name = 'yves_default';
const theme = 'default';
const context = process.cwd();

const paths = {
    public: './public/Yves/assets',
    shop: './vendor/spryker-shop',
    ui: {
        shop: `./vendor/spryker-shop/shop-ui/src/SprykerShop/Yves/ShopUi/Theme/${theme}`,
        project: `./src/Pyz/Yves/ShopUi/Theme/${theme}`
    }
};

module.exports = {
    name,
    theme,
    paths,

    dirs: {
        context,
        public: path.join(context, paths.public),
        shop: path.join(context, paths.shop),
        ui: {
            shop: path.join(context, paths.ui.shop),
            project: path.join(context, paths.ui.project)
        }
    },

    find: {
        componentEntryPoints: {
            dirs: [
                path.join(context, paths.shop)
            ],
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

        componentStyles: {
            dirs: [
                path.join(context, paths.shop)
            ],
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

- `./build/development.js`
```js
const builder = require('@spryker/suite-frontend-builder');
const factory = require('@spryker/suite-frontend-builder/dist/configuration-factory/development');
const settings = require('../settings');
builder.build(settings, factory.DevelopmentConfigurationFactory);
```

- `./build/development-watch.js`
```js
const builder = require('@spryker/suite-frontend-builder');
const factory = require('@spryker/suite-frontend-builder/dist/configuration-factory/development-watch');
const settings = require('../settings');
builder.build(settings, factory.DevelopmentWatchConfigurationFactory);
```

- `./build/production.js`
```js
const builder = require('@spryker/suite-frontend-builder');
const factory = require('@spryker/suite-frontend-builder/dist/configuration-factory/production');
const settings = require('../settings');
builder.build(settings, factory.ProductionConfigurationFactory);
```

These files are extensions to `@spryker/suite-frontend-builder`: they provide settings and define tasks for building the ShopUi.

#### 3. Update `package.json`

Update your `package.json` script section adding the following:
```json
  "scripts": {
    "yves": "node ./frontend/build/development",
    "yves:watch": "node ./frontend/build/development-watch",
    "yves:production": "node ./frontend/build/production"
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
        "./src/Pyz/Yves/ShopUi/Theme/default/vendor.ts"
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
