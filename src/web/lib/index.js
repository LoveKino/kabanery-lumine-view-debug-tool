'use strict';

let spa = require('kabanery-spa');
let {
    n,
    mount
} = require('kabanery');

let debugPage = require('./page/debugPage');
let pfcRequestor = require('crude-server/webLib/pfcRequestor');

let {
    router,
    queryPager
} = spa;

mount(n('div id="pager"'), document.body); // pager as contauner

let {
    forward
} = router(queryPager({
    'debugPage': {
        title: 'debug veiw',
        render: debugPage
    }
}, 'debugPage'), {
    pfcRequest: pfcRequestor()
});

forward(window.location.href);
