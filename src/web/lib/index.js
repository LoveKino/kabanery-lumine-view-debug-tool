'use strict';

let spa = require('kabanery-spa');
let {
    n,
    mount
} = require('kabanery');

let debugPage = require('./page/debugPage');
let {
    apiMap,
    runApi
} = require('./store');

let {
    router,
    queryPager
} = spa;

mount(n('div id="pager"'), document.body); // pager as contauner

let {
    forward
} = router(
    // pages
    queryPager({
        'debugPage': {
            title: 'debug veiw',
            render: debugPage
        }
    }, 'debugPage'),

    // page env
    {
        apiMap,
        runApi
    }
);

forward(window.location.href);
