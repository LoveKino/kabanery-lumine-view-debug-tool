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
let Vn = require('kabanery-lumine/lib/view/layout/vn');
let Hn = require('kabanery-lumine/lib/view/layout/hn');
let Input = require('kabanery-lumine/lib/view/input/input');
let Textarea = require('kabanery-lumine/lib/view/input/textarea');
let Button = require('kabanery-lumine/lib/view/button/button');
let PageLoading = require('kabanery-lumine/lib/view/loading/pageLoading');
let Notice = require('kabanery-lumine/lib/view/notice/notice');
let InputDialog = require('kabanery-lumine/lib/view/modal/inputDialog');

const {
    DO_LOAD_VIEW_FILE,
    DO_SAVE_CASE
} = require('../signals');

module.exports = lumineView(({
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
            n(InputDialog, syncBindWithKeyMap(ctx, {
                'caseNameDialog.show': 'show',
                'caseNameDialog.caseName': 'text'
            }, {
                bindedProps: {
                    title: 'case name',
                    autoHide: false
                }
            })),

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
                        onsignal: onSignalType('click', deliver(ctx, DO_LOAD_VIEW_FILE))
                    }, 'load')
                ])
            ]),

            n(Hn, {
                mode: 'percentage',
                pers: [1, 4, 4]
            }, [
                n('div', [
                    n('h3', 'case list'),
                    n('div', getCaseList(props.cases).map(({
                        value
                    }) => {
                        return n('div', value);
                    }))
                ]),

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
                        onsignal: onSignalType('click', deliver(ctx, DO_SAVE_CASE))
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
        cases: {},

        showLoading: false,

        showNotice: false,
        noticeText: '',

        caseNameDialog: {
            caseName: '',
            show: false
        }
    }
});

let getCaseList = (cases) => {
    let keys = Object.keys(cases).sort();
    return keys.map((key) => {
        return {
            key,
            value: cases[key]
        };
    });
};
