'use strict';

let apiStub = require('../../../common/apiStub');
let pfcApis = require('crude-server/lib/web/pfcApis');

module.exports = pfcApis('/api/pfc', apiStub);
