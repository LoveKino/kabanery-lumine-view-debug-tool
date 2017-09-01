'use strict';

let simpleServer = require('crude-server/lib/server/simpleServer');
let loadViewFile = require('./business/loadViewFile');
let addCase = require('./business/addCase');
let localCaseDirs = require('./business/localCaseDirs');
let apiStub = require('../common/apiStub');

module.exports = ({
    indexHtmlPath,
    assetOutterDir
}) => {
    return simpleServer({
        indexHtmlPath,
        assetOutterDir,
        pfcContexter: () => {
            return Object.assign({
                loadViewFile,
                addCase
            }, localCaseDirs);
        },
        pfcVariableStub: apiStub
    });
};
