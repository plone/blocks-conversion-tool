### [0.7.1](https://github.com/plone/blocks-conversion-tool/compare/0.7.0...0.7.1) (2023-11-03)


### Bug Fixes

* Fix html2slate for tables without headers ([#37](https://github.com/plone/blocks-conversion-tool/issues/37)) ([f92f5c9](https://github.com/plone/blocks-conversion-tool/commit/f92f5c98cfd78cefa5916b784772b57898afa956))
* Wrap td contents in div instead of span ([#38](https://github.com/plone/blocks-conversion-tool/issues/38)) ([ae31295](https://github.com/plone/blocks-conversion-tool/commit/ae3129562c4e0f269a92f0a119f48dcc2487772c))


### Maintenance

* List files to include for npm package instead of files to exclude ([#39](https://github.com/plone/blocks-conversion-tool/issues/39)) ([f14fa2e](https://github.com/plone/blocks-conversion-tool/commit/f14fa2e85fea25c406b50644f15414032457535c))

## [0.7.0](https://github.com/plone/blocks-conversion-tool/compare/0.5.0...0.7.0) (2023-09-11)


### Features

* Import relevant slateTable settings for HTML ui-tables ([#35](https://github.com/plone/blocks-conversion-tool/issues/35)) ([00eaea4](https://github.com/plone/blocks-conversion-tool/commit/00eaea4ec1bcbec38bf96157a330df543e8e4803))


### Maintenance

* Fix formatting ([e8579ab](https://github.com/plone/blocks-conversion-tool/commit/e8579abbefadf05c461ea6166d29e15cd6ecee95))
* Use version 0.6.0 as base ([42e9ab2](https://github.com/plone/blocks-conversion-tool/commit/42e9ab2cafa5c6e7b3f35254e3e074c36b31ca4d))

## [0.5.0](https://github.com/plone/blocks-conversion-tool/compare/0.4.8...0.5.0) (2023-09-06)


### Features

* Pass all data attributes through to image block ([#34](https://github.com/plone/blocks-conversion-tool/issues/34)) ([1bc9aff](https://github.com/plone/blocks-conversion-tool/commit/1bc9aff28ac93d508684f94248ab59d12e5ed13d))


### Bug Fixes

* Convert paragraphs with callout class to slate ([#33](https://github.com/plone/blocks-conversion-tool/issues/33)) ([30f5e11](https://github.com/plone/blocks-conversion-tool/commit/30f5e1198e425897322fc653b6067c72fe6ecf49))

### [0.4.8](https://github.com/plone/blocks-conversion-tool/compare/0.4.7...0.4.8) (2023-07-03)


### Bug Fixes

* Table cell parsing (Fixes [#31](https://github.com/plone/blocks-conversion-tool/issues/31)) ([0500c3d](https://github.com/plone/blocks-conversion-tool/commit/0500c3d29fb9042f7baef79f122dbb5b583d82c5))

### [0.4.7](https://github.com/plone/blocks-conversion-tool/compare/0.4.6...0.4.7) (2023-06-06)


### Bug Fixes

* Additional cases related to [#21](https://github.com/plone/blocks-conversion-tool/issues/21) ([6e137f9](https://github.com/plone/blocks-conversion-tool/commit/6e137f9c2f41b08b659358ba6e36fb29f90f8931))
* Empty inline elements break slate (Fixes [#30](https://github.com/plone/blocks-conversion-tool/issues/30)) ([e57b766](https://github.com/plone/blocks-conversion-tool/commit/e57b76612630e4c5e29d1b492688eaf6a92716cb))
* Fix [#25](https://github.com/plone/blocks-conversion-tool/issues/25) by handling TinyMCE styling for strong and emphasis ([33a29e9](https://github.com/plone/blocks-conversion-tool/commit/33a29e9d4c92d96034be41c3b8ee3043e4148137))
* Handle nested table with images ([c2ba89e](https://github.com/plone/blocks-conversion-tool/commit/c2ba89ea4067049732a3c08a562f4a623f486d74))
* Handle nested table with sibling elements ([bc6a215](https://github.com/plone/blocks-conversion-tool/commit/bc6a215597654b94bff66a514b69efe7b733bc0e))
* Image links converted with new image block format (Fixes [#29](https://github.com/plone/blocks-conversion-tool/issues/29)) ([407a411](https://github.com/plone/blocks-conversion-tool/commit/407a411c70517b6508fcbde7ec054254b3bbeb06))
* Recursively search for IMAGE, VIDEO, IFRAME elements inside text blocks ([50b4290](https://github.com/plone/blocks-conversion-tool/commit/50b429085667094cc6f3d333aec938e0bc14e873))
* Remove elements without any text content ([c085ebd](https://github.com/plone/blocks-conversion-tool/commit/c085ebd092e9abba768c09c78fa63829c426cf79))


### Maintenance

* Add more VSCode launch options ([09df260](https://github.com/plone/blocks-conversion-tool/commit/09df260922ed456938607f315a69b9e66fa9e68f))
* Format .vscode/launch.json ([018a8d3](https://github.com/plone/blocks-conversion-tool/commit/018a8d3b53fdaec9571b78e4fccef5a36b428781))
* remove not needed global.document ([a7ba51b](https://github.com/plone/blocks-conversion-tool/commit/a7ba51bc320f10ecc928285c63aac18993670cc2))

### [0.4.6](https://github.com/plone/blocks-conversion-tool/compare/0.4.5...0.4.6) (2023-03-06)


### Bug Fixes

* Fix issue [#21](https://github.com/plone/blocks-conversion-tool/issues/21) by implementing a better parser for img and video blocks. ([b49614e](https://github.com/plone/blocks-conversion-tool/commit/b49614e517aa07db32c721ae049a300d34fd3832))
* Fix issue [#22](https://github.com/plone/blocks-conversion-tool/issues/22), importing from blocks.js instead of blocks ([ebea336](https://github.com/plone/blocks-conversion-tool/commit/ebea3366520dab02659678844bb4ff2253687fc4))

### [0.4.5](https://github.com/plone/blocks-conversion-tool/compare/0.4.4...0.4.5) (2023-03-03)


### Bug Fixes

* Fix [#20](https://github.com/plone/blocks-conversion-tool/issues/20) by dropping span elements without any value ([442ee31](https://github.com/plone/blocks-conversion-tool/commit/442ee31d77128809d6f6fb5302da0cc9de72f1ef))
* Fix [#21](https://github.com/plone/blocks-conversion-tool/issues/21) by unwrapping images inside span ([78474aa](https://github.com/plone/blocks-conversion-tool/commit/78474aa6beb57e9a4e1aa5940a42e75cfdc317ba))
* Fix broken result when there is a div inside a table cell ([5aba8ce](https://github.com/plone/blocks-conversion-tool/commit/5aba8ce0ca77deb326f6eff7e9567ba3910e568a))
* Fix handling of whitespace between tags ([5469f9d](https://github.com/plone/blocks-conversion-tool/commit/5469f9d2f8c7e9269d0eff05be000ad88c539d50))
* Fix issues [#16](https://github.com/plone/blocks-conversion-tool/issues/16) and [#17](https://github.com/plone/blocks-conversion-tool/issues/17) by placing text and inline elements outside a block element into paragraphs ([34c602a](https://github.com/plone/blocks-conversion-tool/commit/34c602a1dcae5da9e4801a94e822ae621208a00d))


### Maintenance

* Add .editorconfig ([b09d3ac](https://github.com/plone/blocks-conversion-tool/commit/b09d3ac01078fcfcb6dfb39373e05e4145878724))
* Add Jest debugger for VSCode ([ff2258c](https://github.com/plone/blocks-conversion-tool/commit/ff2258cb15769157ff26a9c9080ac5f8f3fd5daf))
* Update GitHub Actions ([c27cf30](https://github.com/plone/blocks-conversion-tool/commit/c27cf3028ab3d23f011f47da600e2d8da181d5da))

### [0.4.4](https://github.com/plone/blocks-conversion-tool/compare/0.4.3...0.4.4) (2022-11-28)


### Bug Fixes

* Don't turn text nodes that are children of table cells into paragraphs ([e96e2c3](https://github.com/plone/blocks-conversion-tool/commit/e96e2c3e49c390cc69b55b106a5a86c94527d6ec))

### [0.4.3](https://github.com/plone/blocks-conversion-tool/compare/0.4.2...0.4.3) (2022-11-09)


### Bug Fixes

* Filter null values from slateTable cells ([cedd0dd](https://github.com/plone/blocks-conversion-tool/commit/cedd0dd448bae1644496427fb4e0eb5368fea5fc))

### [0.4.2](https://github.com/plone/blocks-conversion-tool/compare/0.4.1...0.4.2) (2022-10-27)


### Bug Fixes

* Fix issue [#9](https://github.com/plone/blocks-conversion-tool/issues/9) Missing rows in tables ([495cadc](https://github.com/plone/blocks-conversion-tool/commit/495cadc029d928856cab73fb5e3920e11d820d1c))


### Maintenance

* Use Node 16 ([a0a251a](https://github.com/plone/blocks-conversion-tool/commit/a0a251a31aa773ddfadf1900c7449476ffe65712))

### [0.4.1](https://github.com/plone/blocks-conversion-tool/compare/0.4.0...0.4.1) (2022-02-28)


### Maintenance

* Fix Docker image workflow ([1a599d3](https://github.com/plone/blocks-conversion-tool/commit/1a599d344a67bc6123061a114567cfd710a0d0d8))

## [0.4.0](https://github.com/plone/blocks-conversion-tool/compare/0.3.2...0.4.0) (2022-02-28)


### Bug Fixes

* Fix issue [#6](https://github.com/plone/blocks-conversion-tool/issues/6) Images within headings are dropped. ([fa5394d](https://github.com/plone/blocks-conversion-tool/commit/fa5394daae05089b69ff445f8381d15b8eb3e7fd))
* Manage nested DIV elements. ([45153a4](https://github.com/plone/blocks-conversion-tool/commit/45153a4f024fe7d5da1d6de96c9120a1d5af5225))


### Maintenance

* Add Github Actions workflow to publish new tag to Docker Hub ([03f5065](https://github.com/plone/blocks-conversion-tool/commit/03f5065539f79ac75192374c25a2f86889492b07))
* Add information about commit messages and how to release this package ([f00c69a](https://github.com/plone/blocks-conversion-tool/commit/f00c69a01f807a40576f335c6925124fcd1d22ab))
* Add test for nested paragraphs and links. ([245b7f4](https://github.com/plone/blocks-conversion-tool/commit/245b7f4595ecbb59e80b75ece9e816785ddfc5b8))

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

