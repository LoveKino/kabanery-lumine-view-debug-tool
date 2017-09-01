'use strict';

let FileStore = require('crude-server/lib/server/context/store/fileStore');

let JSONStoreCompiler = require('crude-server/lib/server/context/store/fileStoreCompiler/json');

let {
    query,
    update
} = FileStore({
    cacheInMemory: true,
    completeDir: true,
    compiler: JSONStoreCompiler()
});

let toApi = (names, fn) => (filePath, ...args) => {
    let variableMap = names.reduce((prev, name, index) => {
        prev[name] = args[index];
        return prev;
    }, {});

    return fn(filePath, {
        variableMap
    });
};

/**
 * store all debug case directories
 */
module.exports = {
    getCaseDirs: query('.caseDirs'),
    addCase: toApi(['case'], update('+ .caseDirs = case'))
};
