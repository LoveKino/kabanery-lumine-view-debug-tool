'use strict';

let simpleServer = require('crude-server/lib/server/simpleServer');
let loadViewFile = require('./business/loadViewFile');
let apiStub = require('../common/apiStub');
let commonApis = require('crude-server/lib/server/context/common');
let store = require('./business/store');

module.exports = ({
    indexHtmlPath,
    assetOutterDir
}) => {
    return simpleServer({
        indexHtmlPath,
        assetOutterDir,
        pfcContexter: () => {
            return Object.assign({
                loadViewFile
            }, commonApis, store);
        },
        pfcVariableStub: apiStub
    });
};
