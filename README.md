# Blocks Conversion Tool

[![NPM](https://img.shields.io/npm/v/@plone/blocks-conversion-tool.svg)](https://www.npmjs.com/package/@plone/blocks-conversion-tool)
[![Code analysis checks](https://github.com/plone/blocks-conversion-tool/actions/workflows/code.yml/badge.svg)](https://github.com/plone/blocks-conversion-tool/actions/workflows/code.yml)
[![Unit tests](https://github.com/plone/blocks-conversion-tool/actions/workflows/unit.yml/badge.svg)](https://github.com/plone/blocks-conversion-tool/actions/workflows/unit.yml)

## Introduction

This package implements a server with a simple API to convert HTML (as used in Plone Classic) to Blocks (as used on Volto).

## Starting the server

### From source

```shell
git clone https://github.com/plone/blocks-conversion-tool.git
cd blocks-conversion-tool
yarn install
yarn start
```

### With Docker

```shell
docker run -it -p 5000:5000 plone/blocks-conversion-tool:latest
```

## Usage

## HTML to Blocks (Slate)

[Slate](https://github.com/eea/volto-slate) is going to be the default text block for Plone 6, to convert HTML to an array of blocks call the service passing the HTML as shown below:

```shell
curl -i -X POST http://localhost:5000/html -H "Accept: application/json" -H "Content-Type: application/json" --data-raw '{"html": "<p>Hello world!</p>"}'
```

## HTML to Blocks (DraftJS)

Draft-JS is the legacy default text block used in Volto.

```shell
curl -i -X POST http://localhost:5000/html -H "Accept: application/json" -H "Content-Type: application/json" --data-raw '{"html": "<p>Hello world!</p>", "converter": "draftjs"}'
```
