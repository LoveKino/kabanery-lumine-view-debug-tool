'use strict';

let lumineView = require('kabanery-lumine/lib/util/lumineView');
let n = require('kabanery-lumine/lib/util/n');
let {
    syncBindWithKeyMap
} = require('kabanery-lumine/lib/view/compose/mapUI');
let {
    deliver,
    onSignalType
} = require('kabanery-lumine/lib/util/signal');
let {
    loadingNoticeProgress
} = require('kabanery-lumine/lib/view/loading/loadingApply');
let {
    wrapPagePropsWithStore
} = require('kabanery-lumine/lib/store/storeProps');

let Vn = require('kabanery-lumine/lib/view/layout/vn');
let Hn = require('kabanery-lumine/lib/view/layout/hn');
let Input = require('kabanery-lumine/lib/view/input/input');
let Textarea = require('kabanery-lumine/lib/view/input/textarea');
let Button = require('kabanery-lumine/lib/view/button/button');
let PageLoading = require('kabanery-lumine/lib/view/loading/pageLoading');
let Notice = require('kabanery-lumine/lib/view/notice/notice');

const ACTIONS = {
    DO_LOAD_VIEW_FILE: 'doLoadViewFile',
    DO_SAVE_CASE: 'doSaveCase'
};

// TODO fix multiple update problem
let PageView = lumineView(({
    props
}, ctx) => {
    let clear = null; // cache for last clearEvents interface

    return () => {
        let testView = null,
            testViewErr = null;

        try {
            if (props.viewDefinitionCode) {
                if (clear) {
                    clear();
                }
                testView = eval(`${props.viewDefinitionCode};clear = clearEvents;${props.viewDebugCode}`);
            }
        } catch (err) {
            testViewErr = err.toString();
        }

        return n(Vn, [
            n(PageLoading, syncBindWithKeyMap(ctx, {
                'showLoading': 'show'
            })),
            n(Notice, syncBindWithKeyMap(ctx, {
                'showNotice': 'show',
                'noticeText': 'text'
            })),

            n(Vn, [
                n(Input, syncBindWithKeyMap(ctx, {
                    'viewPath': 'value'
                }, {
                    bindedProps: {
                        placeholder: 'kabanery lumine view file path'
                    }
                })),

                n(Hn, [
                    n(Input, syncBindWithKeyMap(ctx, {
                        'testPath': 'value'
                    }, {
                        bindedProps: {
                            placeholder: 'kabanery lumine view file path'
                        }
                    })),
                    n(Button, {
                        onsignal: onSignalType('click', deliver(ctx, ACTIONS.DO_LOAD_VIEW_FILE))
                    }, 'load')
                ])
            ]),

            n(Hn, {
                mode: 'percentage',
                pers: [1, 4, 4]
            }, [
                n('div', 'case list'),

                n(Vn, [
                    n(Textarea, syncBindWithKeyMap(ctx, {
                        'viewDebugCode': 'value'
                    }, {
                        autoUpdate: true,
                        bindedProps: {
                            style: {
                                width: '100%'
                            }
                        }
                    })),

                    n(Button, {
                        onsignal: onSignalType('click', deliver(ctx, ACTIONS.DO_SAVE_CASE))
                    }, 'save as case')
                ]),

                n('div', [
                    testViewErr || testView
                ])
            ])
        ]);
    };
}, {
    defaultProps: {
        viewPath: '',
        testPath: '',
        viewDebugCode: null,
        viewDefinitionCode: '',
        showLoading: false,
        showNotice: false,
        noticeText: ''
    }
});

module.exports = ({
    apiMap,
    runApi
}) => {
    let pageView = n(PageView, wrapPagePropsWithStore({
        onsignal: (signal, data, ctx) => {
            if (signal.type === ACTIONS.DO_LOAD_VIEW_FILE) {
                loadViewFileHandler(ctx);
            } else if (signal.type === ACTIONS.DO_SAVE_CASE) {
                if (data.props.viewPath) {
                    if (data.props.testPath) {
                        //
                        saveCaseHandler(ctx);
                    } else {
                        // notice
                        ctx.update([
                            ['props.showNotice', true],
                            ['props.noticeText', 'empty test path!']
                        ]);
                    }
                } else {
                    // notice
                    ctx.update([
                        ['props.showNotice', true],
                        ['props.noticeText', 'empty view path!']
                    ]);
                }
            }
        }
    }, {
        blackList: ['showLoading', 'viewDefinitionCode', 'showNotice', 'noticeText', 'theme']
    }));

    let loadingPromise = (fn) => {
        return loadingNoticeProgress(fn, pageView.ctx, 'props.showLoading', 'props.showNotice', 'props.noticeText');
    };

    let saveCaseHandler = loadingPromise((ctx) => {
        let props = ctx.getData().props;
        let viewPath = props.viewPath;
        let testPath = props.testPath;
        return runApi(apiMap.addCase(viewPath, testPath));
    });

    let loadViewFileHandler = loadingPromise((ctx) => {
        let props = ctx.getData().props;
        let viewPath = props.viewPath;
        let testPath = props.testPath;
        if (!testPath) {
            testPath = getDefaultTestDir(viewPath);
        }

        return runApi(apiMap.loadViewFile(viewPath)).then((data) => {
            let viewDefinitionCode = `let {TestedView, clearEvents} = ${data.viewCode}`;
            let viewDebugCode = props.viewDebugCode;
            if (viewDebugCode === null) {
                viewDebugCode = 'n(TestedView, {}, [])';
            }

            return pageView.ctx.updateWithNotify(null, [
                ['props.viewDefinitionCode', viewDefinitionCode],
                ['props.viewDebugCode', viewDebugCode],
                ['props.testPath', testPath]
            ]);
        });
    }, pageView.ctx, 'props.showLoading', 'props.showNotice', 'props.noticeText');

    // loading data at first
    if (pageView.ctx.getData().props.viewPath) {
        loadViewFileHandler(pageView.ctx);
    }

    return pageView;
};

let getDefaultTestDir = (jsPath) => {
    let parts = jsPath.split('/');
    let name = parts.pop();
    parts.push('__test__');
    parts.push(name);
    return parts.join('/');
};
