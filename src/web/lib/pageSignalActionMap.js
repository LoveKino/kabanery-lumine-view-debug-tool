'use strict';

const {
    DO_LOAD_VIEW_FILE,
    DO_SAVE_CASE
} = require('./signals');

let getDefaultTestFile = (jsPath) => {
    let parts = jsPath.split('/');
    let name = parts.pop();
    parts.push('.' + name + '.lumine_view.case');
    return parts.join('/');
};

module.exports = {
    debugPage: {
        'kabanery_page_render': [{
            type: 'updateState',
            content: '.viewState.props.showLoading = true'
        }, {
            type: 'sendRequest',
            content: 'loadViewFile(.viewState.props.viewPath)',
            response: `.viewState.props.showLoading=false;
                   .viewState.props.viewDefinitionCode=getViewDefinitionCode(.response.viewCode);
                   .viewState.props.viewDebugCode=getViewDebugCode(.viewState.props.viewDebugCode);
                   .viewState.props.testPath=getTestPath(.viewState.props.testPath, .viewState.props.viewPath);`,
            error: '.viewState.props.showLoading=false;.viewState.props.showNotice=true;.viewState.props.noticeText=.errorMsg;',
            variableMap: {
                getViewDefinitionCode: (viewCode) => `let {TestedView, clearEvents} = ${viewCode}`,
                getViewDebugCode: (viewDebugCode) => viewDebugCode === null ? 'n(TestedView, {}, [])' : viewDebugCode,
                getTestPath: (testPath, viewPath) => {
                    return testPath ? testPath : getDefaultTestFile(viewPath);
                }
            }
        }],

        [DO_LOAD_VIEW_FILE]: [{
            type: 'updateState',
            content: '.viewState.props.showLoading = true'
        }, {
            type: 'sendRequest',
            content: 'loadViewFile(.viewState.props.viewPath)',
            response: `.viewState.props.showLoading=false;
                   .viewState.props.viewDefinitionCode=getViewDefinitionCode(.response.viewCode);
                   .viewState.props.viewDebugCode=getViewDebugCode(.viewState.props.viewDebugCode);
                   .viewState.props.testPath=getTestPath(.viewState.props.testPath, .viewState.props.viewPath);`,
            error: '.viewState.props.showLoading=false;.viewState.props.showNotice=true;.viewState.props.noticeText=.errorMsg;',
            variableMap: {
                getViewDefinitionCode: (viewCode) => `let {TestedView, clearEvents} = ${viewCode}`,
                getViewDebugCode: (viewDebugCode) => viewDebugCode === null ? 'n(TestedView, {}, [])' : viewDebugCode,
                getTestPath: (testPath, viewPath) => {
                    return testPath ? testPath : getDefaultTestFile(viewPath);
                }
            }
        }],

        [DO_SAVE_CASE]: [{
            type: 'updateState',
            content: '.viewState.props.showLoading = true'
        }, {
            type: 'sendRequest',
            content: 'addCase(.viewState.props.testPath, .viewState.props.viewDebugCode)',
            response: '.viewState.props.showLoading = false',
            error: '.viewState.props.showLoading = false;.viewState.props.showNotice = true;.viewState.props.noticeText = .errorMsg;'
        }]
    }
};
