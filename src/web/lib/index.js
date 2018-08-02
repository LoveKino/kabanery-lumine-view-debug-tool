'use strict';

let {
    SPA
} = require('kabanery-lumine/lib/page/flowPfcSPA');
let apiStub = require('../../common/apiStub');
let pageSignalActionMap = require('./pageSignalActionMap');
let pageViewMap = require('./page');

SPA({
    apiStub,
    pageViewMap,
    pageSignalActionMap,
    pageOptionsMap: {
        debugPage: {
            localStateStore: true,
            // TODO whiteList
            localStateStoreBlackList: ['showLoading', 'viewDefinitionCode', 'showNotice', 'noticeText', 'theme', 'caseNameDialog']
        }
    },
    defaultPage: 'debugPage'
});
