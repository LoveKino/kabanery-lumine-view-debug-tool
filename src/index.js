'use strict';

let path = require('path');
let debugServer = require('./server');

let log = console.log; // eslint-disable-line

let startServer = ({
    port = 5435
} = {}) => {
    let {
        start
    } = debugServer({
        indexHtmlPath: path.join(__dirname, './web/index.html'),
        assetOutterDir: path.join(__dirname, './web')
    });

    return start(port).then(({
        address
    }) => {
        log(`debugview server start at ${address.port}`);
    });
};

module.exports = {
    startServer
};
