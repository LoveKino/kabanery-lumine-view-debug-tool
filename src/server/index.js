'use strict';

let simpleServer = require('crude-server/lib/simpleServer');
let loadViewFile = require('./loadViewFile');

module.exports = ({
    indexHtmlPath,
    assetOutterDir
}) => {
    return simpleServer({
        indexHtmlPath,
        assetOutterDir,
        pfcContexter: () => {
            return {
                add: (x, y) => x + y,

                loadViewFile
            };
        }
    });
};
