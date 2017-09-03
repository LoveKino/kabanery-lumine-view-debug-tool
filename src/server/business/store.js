'use strict';

let SimpleFileStoreApi = require('crude-server/lib/server/context/store/simpleFileStoreApi');

module.exports = SimpleFileStoreApi({
    apiMap: {
        // case file
        addCase: {
            type: 'update',
            script: '+ .cases = caseCode',
            paramNames: ['caseCode']
        },

        getCaseList: {
            script: '.cases'
        }
    }
});
