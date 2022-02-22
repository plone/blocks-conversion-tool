### [0.3.2](https://github.com/plone/blocks-conversion-tool/compare/0.3.1...0.3.2) (2022-02-18)


### Bug Fixes

* Remove from the src the /@[@images](https://github.com/images) suffix (bare Plone uses it, but then it's not supported in the default Volto block. ([d241cbc](https://github.com/plone/blocks-conversion-tool/commit/d241cbc88ba1a8296812102b06ffd900a66c0a38))


### Changes

* Do not issue a in slate, always link types. This is consistent with how is the default behavior in slate. ([5951c59](https://github.com/plone/blocks-conversion-tool/commit/5951c59e2604321cca5c6dc83051cb9a00812041))


### Maintenance

* Add CI yarn test command ([f57da58](https://github.com/plone/blocks-conversion-tool/commit/f57da5870db76c6f3c05da28ed3a14ca08ab2f0b))
* Add make release-package and make release-package-dry-run ([dfb1e02](https://github.com/plone/blocks-conversion-tool/commit/dfb1e0292bfe58ea75eb85dd85d641dd29a40ff0))
* Improve Makefile for building and releasing the Docker image ([e79360e](https://github.com/plone/blocks-conversion-tool/commit/e79360e4b998c0dc31f32e5289bfb657b0e858b6))
* Lint fixes ([7b62b6c](https://github.com/plone/blocks-conversion-tool/commit/7b62b6c8d9d842f3f4995a42fc35cba001b006fd))

### [0.3.1](https://github.com/plone/blocks-conversion-tool/compare/0.3.0...0.3.1) (2022-01-07)


### Bug Fixes

* Deal with slateTable cells with nested elements ([7eff6ad](https://github.com/plone/blocks-conversion-tool/commit/7eff6ad4d1a0575bb8b13a37225242dd9bf68adc))

## [0.3.0](https://github.com/plone/blocks-conversion-tool/compare/0.2.0...0.3.0) (2022-01-07)


### Features

* Improve slateTable block conversion ([dd71acd](https://github.com/plone/blocks-conversion-tool/commit/dd71acdc6aebf32dd40c359892f6268ce464e1fe))


### Maintenance

* Add release-image to Makefile ([fda42be](https://github.com/plone/blocks-conversion-tool/commit/fda42be58c49e3e9bcdb9a66b56f434db5792f87))

## [0.2.0](https://github.com/plone/blocks-conversion-tool/compare/0.1.0...0.2.0) (2021-12-20)


### Features

* Support parsing video element with inner source element ([b1baa76](https://github.com/plone/blocks-conversion-tool/commit/b1baa76c5626b7608dd07f7cb5c03aa12d72fcb3))

## 0.1.0 (2021-10-08)


### Maintenance

* Add release packages. ([1650e4b](https://github.com/plone/blocks-conversion-tool/commit/1650e4bba82ab93f6628daf56c321c223e4730f8))
* Add release-it configuraion to package.json. ([ceba8ab](https://github.com/plone/blocks-conversion-tool/commit/ceba8ab07b985f9f682debc237b514a3d0ff7f51))
* Initial public release. ([e446c04](https://github.com/plone/blocks-conversion-tool/commit/e446c04f05832abc61ce9a1d5222bb76910ae6e2))
* Make package public. ([f595375](https://github.com/plone/blocks-conversion-tool/commit/f595375867283a68706961fdb13a3126ef0c8140))
* Update .npmignore file. ([9ac611e](https://github.com/plone/blocks-conversion-tool/commit/9ac611e942934519f75f35779f0192a5e9842eeb))

