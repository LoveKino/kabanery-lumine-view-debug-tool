/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 26);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * basic types
 */

let truth = () => true;

let isUndefined = v => v === undefined;

let isNull = v => v === null;

let isFalsy = v => !v;

let likeArray = v => !!(v && typeof v === 'object' && typeof v.length === 'number' && v.length >= 0);

let isArray = v => Array.isArray(v);

let isString = v => typeof v === 'string';

let isObject = v => !!(v && typeof v === 'object');

let isFunction = v => typeof v === 'function';

let isNumber = v => typeof v === 'number' && !isNaN(v);

let isBool = v => typeof v === 'boolean';

let isNode = (o) => {
    return (
        typeof Node === 'object' ? o instanceof Node :
        o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
    );
};

let isPromise = v => v && typeof v === 'object' && typeof v.then === 'function' && typeof v.catch === 'function';

let isRegExp = v => v instanceof RegExp;

let isReadableStream = (v) => isObject(v) && isFunction(v.on) && isFunction(v.pipe);

let isWritableStream = v => isObject(v) && isFunction(v.on) && isFunction(v.write);

/**
 * check type
 *
 * types = [typeFun]
 */
let funType = (fun, types = []) => {
    if (!isFunction(fun)) {
        throw new TypeError(typeErrorText(fun, 'function'));
    }

    if (!likeArray(types)) {
        throw new TypeError(typeErrorText(types, 'array'));
    }

    for (let i = 0; i < types.length; i++) {
        let typeFun = types[i];
        if (typeFun) {
            if (!isFunction(typeFun)) {
                throw new TypeError(typeErrorText(typeFun, 'function'));
            }
        }
    }

    return function() {
        // check type
        for (let i = 0; i < types.length; i++) {
            let typeFun = types[i];
            let arg = arguments[i];
            if (typeFun && !typeFun(arg)) {
                throw new TypeError(`Argument type error. Arguments order ${i}. Argument is ${arg}. function is ${fun}, args are ${arguments}.`);
            }
        }
        // result
        return fun.apply(this, arguments);
    };
};

let and = (...args) => {
    if (!any(args, isFunction)) {
        throw new TypeError('The argument of and must be function.');
    }
    return (v) => {
        for (let i = 0; i < args.length; i++) {
            let typeFun = args[i];
            if (!typeFun(v)) {
                return false;
            }
        }
        return true;
    };
};

let or = (...args) => {
    if (!any(args, isFunction)) {
        throw new TypeError('The argument of and must be function.');
    }

    return (v) => {
        for (let i = 0; i < args.length; i++) {
            let typeFun = args[i];
            if (typeFun(v)) {
                return true;
            }
        }
        return false;
    };
};

let not = (type) => {
    if (!isFunction(type)) {
        throw new TypeError('The argument of and must be function.');
    }
    return (v) => !type(v);
};

let any = (list, type) => {
    if (!likeArray(list)) {
        throw new TypeError(typeErrorText(list, 'list'));
    }
    if (!isFunction(type)) {
        throw new TypeError(typeErrorText(type, 'function'));
    }

    for (let i = 0; i < list.length; i++) {
        if (!type(list[i])) {
            return false;
        }
    }
    return true;
};

let exist = (list, type) => {
    if (!likeArray(list)) {
        throw new TypeError(typeErrorText(list, 'array'));
    }
    if (!isFunction(type)) {
        throw new TypeError(typeErrorText(type, 'function'));
    }

    for (let i = 0; i < list.length; i++) {
        if (type(list[i])) {
            return true;
        }
    }
    return false;
};

let mapType = (map) => {
    if (!isObject(map)) {
        throw new TypeError(typeErrorText(map, 'obj'));
    }

    for (let name in map) {
        let type = map[name];
        if (!isFunction(type)) {
            throw new TypeError(typeErrorText(type, 'function'));
        }
    }

    return (v) => {
        if (!isObject(v)) {
            return false;
        }

        for (let name in map) {
            let type = map[name];
            let attr = v[name];
            if (!type(attr)) {
                return false;
            }
        }

        return true;
    };
};

let listType = (type) => {
    if (!isFunction(type)) {
        throw new TypeError(typeErrorText(type, 'function'));
    }

    return (list) => any(list, type);
};

let typeErrorText = (v, expect) => {
    return `Expect ${expect} type, but got type ${typeof v}, and value is ${v}`;
};

module.exports = {
    isArray,
    likeArray,
    isString,
    isObject,
    isFunction,
    isNumber,
    isBool,
    isNode,
    isPromise,
    isNull,
    isUndefined,
    isFalsy,
    isRegExp,
    isReadableStream,
    isWritableStream,

    funType,
    any,
    exist,

    and,
    or,
    not,
    mapType,
    listType,
    truth
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject, funType, or, isString, isFalsy, likeArray
} = __webpack_require__(0);

let iterate = __webpack_require__(17);

let {
    map, reduce, find, findIndex, forEach, filter, any, exist, compact
} = __webpack_require__(32);

let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

let difference = (list1, list2, fopts) => {
    return reduce(list1, (prev, item) => {
        if (!contain(list2, item, fopts) &&
            !contain(prev, item, fopts)) {
            prev.push(item);
        }
        return prev;
    }, []);
};

let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

let setValueKey = (obj, value, key) => {
    obj[key] = value;
    return obj;
};

let interset = (list1, list2, fopts) => {
    return reduce(list1, (prev, cur) => {
        if (contain(list2, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, []);
};

let deRepeat = (list, fopts, init = []) => {
    return reduce(list, (prev, cur) => {
        if (!contain(prev, cur, fopts)) {
            prev.push(cur);
        }
        return prev;
    }, init);
};

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let flat = (list) => {
    if (likeArray(list) && !isString(list)) {
        return reduce(list, (prev, item) => {
            prev = prev.concat(flat(item));
            return prev;
        }, []);
    } else {
        return [list];
    }
};

module.exports = {
    flat,
    contain,
    difference,
    union,
    interset,
    map,
    reduce,
    iterate,
    find,
    findIndex,
    deRepeat,
    forEach,
    filter,
    any,
    exist,
    get,
    delay,
    mergeMap,
    compact
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    view
} = __webpack_require__(6);

let steadyTheme = __webpack_require__(63);

let {
    deepMergeMap,
    resolveFnValue
} = __webpack_require__(3);

let ClassTable = __webpack_require__(64);

let {
    Signal
} = __webpack_require__(4);

/**
 * define the general interface for lumine view
 *
 * 1. unify view data structure
 *
 *    view data = {
 *       // public data
 *       props,
 *       children // child views
 *    }
 *
 *    props.onsigal
 *    props.theme
 *
 * 2. onsignal interface
 *
 *    onsignal: (signal, data, ctx) -> Any
 */

module.exports = (viewFun, {
    defaultProps = {},
    defaultChildren = [],
    theme = steadyTheme,
    classTable
} = {}) => {
    let defaultStyle = defaultProps.style || {};

    let defaultStyleValue = resolveFnValue(defaultStyle, theme);
    let classTableValue = resolveFnValue(classTable, theme);

    let {
        appendStyle,
        getClassName,
        updateClassTable
    } = ClassTable(classTableValue);

    return view((viewData, ctx) => {
        viewData.props = viewData.props || {};
        viewData.children = (viewData.children && viewData.children.length) ? viewData.children : defaultChildren;
        viewData.props.theme = viewData.props.theme || theme;

        appendStyle();
        // TODO check view Data

        // update defaultStyleValue
        if (viewData.props.theme && typeof defaultStyle === 'function') {
            defaultStyleValue = resolveFnValue(defaultStyle, viewData.props.theme);
        }

        // update class table
        if (viewData.theme && typeof classTable === 'function') {
            classTableValue = resolveFnValue(classTable, viewData.props.theme);
            updateClassTable(classTableValue);
        }

        // merge (deep merge)
        viewData.props.style = deepMergeMap(viewData.props.style, defaultStyleValue);
        viewData.props = deepMergeMap(viewData.props, defaultProps);

        let notify = (signal) => {
            viewData.props.onsignal && viewData.props.onsignal(signal, ctx.getData(), ctx);
        };

        let updateWithNotify = (signal, ...updateScript) => {
            signal = signal || Signal('update-view-data');
            ctx.update(...updateScript);
            // notify
            notify(signal);
        };

        ctx.notify = notify;
        ctx.updateWithNotify = updateWithNotify;
        ctx.getClassName = getClassName;

        return viewFun(viewData, ctx);
    });
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let styles = (...styleObjects) => {
    return Object.assign({}, ...styleObjects);
};

let isMapObject = (v) => {
    return v && typeof v === 'object' && !Array.isArray(v);
};

let deepMergeMap = (tar, def, path = '', options = {}) => {
    let blackList = options.blackList || [];
    if (blackList.findIndex((item) => item === path) !== -1) {
        return tar;
    }
    if (isMapObject(def)) {
        tar = tar || {};
        if (isMapObject(tar)) {
            for (let name in def) {
                tar[name] = deepMergeMap(tar[name], def[name], path === '' ? name : path + '.' + name, options);
            }
        }
        return tar;
    } else {
        if (tar === undefined) return def;
        return tar;
    }
};

let resolveFnValue = (fn, ...args) => {
    if (typeof fn === 'function') {
        return resolveFnValue(fn(...args));
    }

    return fn;
};

let get = (obj, key = '') => {
    key = key.trim();
    let parts = !key ? [] : key.split('.');

    let partLen = parts.length;
    for (let i = 0; i < partLen; i++) {
        let part = parts[i].trim();
        if (part) {
            obj = obj[part];
        }
    }

    return obj;
};

let set = (obj, key = '', value) => {
    key = key.trim();
    let parts = !key ? [] : key.split('.');
    if (!parts.length) return;
    let parent = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        let part = parts[i];
        part = part.trim();
        if (part) {
            let next = parent[part];
            if (!isObject(next)) {
                next = {};
                parent[part] = next;
            }
            parent = next;
        }
    }

    parent[parts[parts.length - 1]] = value;
    return obj;
};

let isObject = (v) => v && typeof v === 'object';

let likeArray = (v) => v && typeof v === 'object' && typeof v.length === 'number';

module.exports = {
    styles,
    isMapObject,
    deepMergeMap,
    resolveFnValue,
    get,
    set,
    isObject,
    likeArray
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let Signal = (type, data) => {
    return {
        type,
        data
    };
};

let isSignalType = (s, type) => {
    return s.type === type;
};

let onSignalType = (expectType, fn) => (signal, ...rest) => {
    if (isSignalType(signal, expectType)) {
        return fn(signal, ...rest);
    }
};

let deliver = (ctx, type, extra) => (sourceSignal, sourceData, sourceCtx) => {
    ctx.notify(Signal(type, {
        sourceType: 'delivered',
        sourceSignal,
        sourceData,
        sourceCtx,
        extra
    }));
};

module.exports = {
    Signal,
    onSignalType,
    isSignalType,
    deliver
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    reduce
} = __webpack_require__(1);
let {
    funType, isObject, or, isString, isFalsy
} = __webpack_require__(0);

let defineProperty = (obj, key, opts) => {
    if (Object.defineProperty) {
        Object.defineProperty(obj, key, opts);
    } else {
        obj[key] = opts.value;
    }
    return obj;
};

let hasOwnProperty = (obj, key) => {
    if (obj.hasOwnProperty) {
        return obj.hasOwnProperty(key);
    }
    for (var name in obj) {
        if (name === key) return true;
    }
    return false;
};

let toArray = (v = []) => Array.prototype.slice.call(v);

/**
 * a.b.c
 */
let get = funType((sandbox, name = '') => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    return reduce(parts, getValue, sandbox, invertLogic);
}, [
    isObject,
    or(isString, isFalsy)
]);

let getValue = (obj, key) => obj[key];

let invertLogic = v => !v;

let set = (sandbox, name = '', value) => {
    name = name.trim();
    let parts = !name ? [] : name.split('.');
    let parent = sandbox;
    if (!isObject(parent)) return;
    if (!parts.length) return;
    for (let i = 0; i < parts.length - 1; i++) {
        let part = parts[i];
        parent = parent[part];
        // avoid exception
        if (!isObject(parent)) return null;
    }

    parent[parts[parts.length - 1]] = value;
    return true;
};

/**
 * provide property:
 *
 * 1. read props freely
 *
 * 2. change props by provide token
 */

let authProp = (token) => {
    let set = (obj, key, value) => {
        let temp = null;

        if (!hasOwnProperty(obj, key)) {
            defineProperty(obj, key, {
                enumerable: false,
                configurable: false,
                set: (value) => {
                    if (isObject(value)) {
                        if (value.token === token) {
                            // save
                            temp = value.value;
                        }
                    }
                },
                get: () => {
                    return temp;
                }
            });
        }

        setProp(obj, key, value);
    };

    let setProp = (obj, key, value) => {
        obj[key] = {
            token,
            value
        };
    };

    return {
        set
    };
};

let evalCode = (code) => {
    if (typeof code !== 'string') return code;
    return eval(`(function(){
    try {
        ${code}
    } catch(err) {
        console.log('Error happened, when eval code.');
        throw err;
    }
})()`);
};

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

let runSequence = (list, params = [], context, stopV) => {
    if (!list.length) {
        return Promise.resolve();
    }
    let fun = list[0];
    let v = fun && fun.apply(context, params);
    if (stopV && v === stopV) {
        return Promise.resolve(stopV);
    }
    return Promise.resolve(v).then(() => {
        return runSequence(list.slice(1), params, context, stopV);
    });
};

module.exports = {
    defineProperty,
    hasOwnProperty,
    toArray,
    get,
    set,
    authProp,
    evalCode,
    delay,
    runSequence
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(47);

/**
 * @readme-doc
 *
 * ## features
 *
 * - simple DOM DSL, construct dom tree quickly
 *
 * - data-driven view, include updating view by data
 *
 * - Just functions, easy to compose
 *
 * [readme-lang:zh]## 特征
 *
 * - 简单的DOM DSL，快速构建DOM结构
 *
 * - 数据驱动视图，包括通过数据更新视图
 *
 * - 以函数为核心，易于复合
 *
 */

/**
 * @readme-quick-run
 *
 * Using method n to construct dom node quickly.
 *
 * [readme-lang:zh]用方法n快速构造dom节点
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {n, mount} = kabanery;
 *
 * mount(n('div', {
 *   id: 'qu',
 *   style: {
 *      backgroundColor: 'red'
 *   }
 * }, [
 *      n('span class=go style="font-size:16px"', 'hello!')
 * ]), document.body);
 *
 * console.log(document.getElementById('qu').outerHTML); // print result
 */

/**
 * @readme-quick-run
 *
 * Basic way to construct a view.
 *
 * [readme-lang:zh]构造一个组件的简单方法
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data) => {
 *      let {type} = data;
 *
 *      return n('div', {
 *         id: 'test1',
 *         style: {
 *            fontSize: 10
 *         }
 *      },[
 *          type === 2 && n('span', 'second'),
 *          type === 3 && n('div', 'third')
 *      ]);
 * });
 *
 * mount(MyView({type: 3}), document.body);
 *
 * console.log(document.getElementById('test1').outerHTML); // print result
 */

/**
 * @readme-quick-run
 *
 * Using update api to update a view.
 *
 * [readme-lang:zh]运用update api去更新一个view
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data, {update}) => {
 *      return n('div', {
 *         id: 'a',
 *         style: {
 *            fontSize: 10
 *         },
 *         onclick: () => {
 *            update('show', !data.show);
 *         }
 *      }, [
 *          data.show && n('div', 'show text')
 *      ]);
 * });
 *
 * mount(MyView({show: false}), document.body);
 *
 * document.getElementById('a').click(); // simulate user action
 * console.log(document.getElementById('a').outerHTML); // print result
 */


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n,
    parseArgs
} = __webpack_require__(6);

module.exports = (...args) => {
    let tagName = args[0];

    if (typeof tagName === 'string') {
        return n(...args);
    } else {
        let {
            attributes,
            childs
        } = parseArgs(args, {
            doParseStyle: false
        });

        return tagName({
            props: attributes,
            children: childs
        });
    }
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let shadowFrame = __webpack_require__(29);

let startMomenter = __webpack_require__(30);

let getX = (elem) => {
    var x = 0;
    while (elem) {
        x = x + elem.offsetLeft;
        elem = elem.offsetParent;
    }
    return x;
};

let getY = (elem) => {
    var y = 0;
    while (elem) {
        y = y + elem.offsetTop;
        elem = elem.offsetParent;
    }
    return y;
};

let getClientX = (elem) => {
    return getX(elem) - window.scrollX;
};

let getClientY = (elem) => {
    return getY(elem) - window.scrollY;
};

let removeChilds = (node) => {
    while (node && node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

let once = (node, type, handler, useCapture) => {
    let fun = function(e) {
        let ret = handler.apply(this, [e]);
        node.removeEventListener(type, fun, useCapture);
        return ret;
    };

    node.addEventListener(type, fun, useCapture);
};

let getAttributeMap = (attributes = []) => {
    let map = {};
    for (let i = 0; i < attributes.length; i++) {
        let {
            name, value
        } = attributes[i];
        map[name] = value;
    }
    return map;
};

let getClasses = (clz = '') => {
    let ret = [];
    let items = clz.split(' ');
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        item = item.trim();
        if (item) {
            ret.push(item);
        }
    }
    return ret;
};

module.exports = {
    getX,
    getY,
    getClientX,
    getClientY,
    removeChilds,
    once,
    shadowFrame,
    getAttributeMap,
    startMomenter,
    getClasses
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    map
} = __webpack_require__(1);
let {
    isObject, isNode
} = __webpack_require__(0);

let parseArgs = __webpack_require__(33);

let parseStyle = __webpack_require__(18);

const KABANERY_NODE = 'kabanery_node';

// TODO general proxy n way

let cn = (elementType) => {
    return (...args) => {
        let {
            tagName, attributes, childs
        } = parseArgs(args);

        if (isKabaneryNode(attributes)) {
            childs = [attributes];
            attributes = {};
        }

        // plugin
        runPlugins(attributes['plugin'], tagName, attributes, childs);

        let {
            attrMap, eventMap
        } = splitAttribues(attributes);

        return {
            tagName,
            attrMap,
            eventMap,
            elementType,
            type: KABANERY_NODE, childNodes: childs,
        };
    };
};

let isKabaneryNode = (v) => isObject(v) && v.type === KABANERY_NODE;

let bindPlugs = (typen, plugs = []) => (...args) => {
    let {
        tagName, attributes, childs
    } = parseArgs(args);

    let oriPlugs = attributes.plugin = attributes.plugin || [];
    attributes.plugin = oriPlugs.concat(plugs);

    let node = typen(tagName, attributes, childs);

    return node;
};

let runPlugins = (plugs = [], tagName, attributes, childExp) => {
    for (let i = 0; i < plugs.length; i++) {
        let plug = plugs[i];
        plug && plug(tagName, attributes, childExp);
    }
};

let splitAttribues = (attributes) => {
    let attrMap = {},
        eventMap = {};
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            eventMap[name.substring(2)] = item;
        } else if (name !== 'plugin') {
            attrMap[name] = item;
        }
    }
    return {
        attrMap,
        eventMap
    };
};

// TODO svg
let toHTML = (node) => {
    if (isNode(node)) {
        return node.outerHTML;
    } else if (isKabaneryNode(node)) {
        let {
            tagName, attrMap, childNodes
        } = node;
        let attrStr = map(attrMap, (value, key) => `${key}="${value}"`).join(' ');
        attrStr = attrStr ? ' ' + attrStr : '';
        return `<${tagName}${attrStr}>${map(childNodes, toHTML).join('')}</${tagName}>`;
    } else {
        return node + '';
    }
};

module.exports = {
    n: cn('html'),
    svgn: cn('svg'),
    cn,
    bindPlugs,
    isKabaneryNode,
    toHTML,
    parseArgs,
    parseStyle
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    createElement, createSvgElement
} = __webpack_require__(41);

let {
    bindEvents
} = __webpack_require__(11);

let {
    map
} = __webpack_require__(1);

let {
    isKabaneryNode
} = __webpack_require__(9);

let reduceNode = (node) => {
    if (isKabaneryNode(node)) {
        let tarNode = null;
        if (node.elementType === 'html') {
            tarNode = createElement(node.tagName, node.attrMap, map(node.childNodes, reduceNode));
        } else {
            tarNode = createSvgElement(node.tagName, node.attrMap, map(node.childNodes, reduceNode));
        }

        bindEvents(tarNode, node.eventMap);
        return tarNode;
    } else {
        return node;
    }
};

module.exports = reduceNode;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let EventMatrix = __webpack_require__(42);

let {
    listenEventType,
    attachDocument,
    dispatchEvent
} = EventMatrix();

let bindEvents = (node, eventMap) => {
    // hook event at node
    node.__eventMap = eventMap;

    for (let type in eventMap) {
        listenEventType(type);
    }
};

module.exports = {
    bindEvents,
    attachDocument,
    dispatchEvent
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    map
} = __webpack_require__(1);
let {
    isObject, isNode
} = __webpack_require__(0);

let parseArgs = __webpack_require__(48);

let parseStyle = __webpack_require__(21);

const KABANERY_NODE = 'kabanery_node';

// TODO general proxy n way

let cn = (elementType) => {
    return (...args) => {
        let {
            tagName, attributes, childs
        } = parseArgs(args);

        if (isKabaneryNode(attributes)) {
            childs = [attributes];
            attributes = {};
        }

        // plugin
        runPlugins(attributes['plugin'], tagName, attributes, childs);

        let {
            attrMap, eventMap
        } = splitAttribues(attributes);

        return {
            tagName,
            attrMap,
            eventMap,
            elementType,
            type: KABANERY_NODE, childNodes: childs,
        };
    };
};

let isKabaneryNode = (v) => isObject(v) && v.type === KABANERY_NODE;

let bindPlugs = (typen, plugs = []) => (...args) => {
    let {
        tagName, attributes, childs
    } = parseArgs(args);

    let oriPlugs = attributes.plugin = attributes.plugin || [];
    attributes.plugin = oriPlugs.concat(plugs);

    let node = typen(tagName, attributes, childs);

    return node;
};

let runPlugins = (plugs = [], tagName, attributes, childExp) => {
    for (let i = 0; i < plugs.length; i++) {
        let plug = plugs[i];
        plug && plug(tagName, attributes, childExp);
    }
};

let splitAttribues = (attributes) => {
    let attrMap = {},
        eventMap = {};
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            eventMap[name.substring(2)] = item;
        } else if (name !== 'plugin') {
            attrMap[name] = item;
        }
    }
    return {
        attrMap,
        eventMap
    };
};

// TODO svg
let toHTML = (node) => {
    if (isNode(node)) {
        return node.outerHTML;
    } else if (isKabaneryNode(node)) {
        let {
            tagName, attrMap, childNodes
        } = node;
        let attrStr = map(attrMap, (value, key) => `${key}="${value}"`).join(' ');
        attrStr = attrStr ? ' ' + attrStr : '';
        return `<${tagName}${attrStr}>${map(childNodes, toHTML).join('')}</${tagName}>`;
    } else {
        return node + '';
    }
};

module.exports = {
    n: cn('html'),
    svgn: cn('svg'),
    cn,
    bindPlugs,
    isKabaneryNode,
    toHTML,
    parseArgs,
    parseStyle
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let uuidv4 = __webpack_require__(55);

let seed = uuidv4();

module.exports = {
    eventMapHook: `__eventMap_${seed}`,
    globalEventTypePrefix: `__event_type_id_${seed}_`,
    stopPropagationFlag: '__stopPropagation'
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    createElement, createSvgElement
} = __webpack_require__(60);

let {
    bindEvents
} = __webpack_require__(15);

let {
    map
} = __webpack_require__(1);

let {
    isKabaneryNode
} = __webpack_require__(12);

let reduceNode = (node) => {
    if (isKabaneryNode(node)) {
        let tarNode = null;
        if (node.elementType === 'html') {
            tarNode = createElement(node.tagName, node.attrMap, map(node.childNodes, reduceNode));
        } else {
            tarNode = createSvgElement(node.tagName, node.attrMap, map(node.childNodes, reduceNode));
        }

        bindEvents(tarNode, node.eventMap);
        return tarNode;
    } else {
        return node;
    }
};

module.exports = reduceNode;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let EventMatrix = __webpack_require__(61);

let {
    eventMapHook
} = __webpack_require__(13);

let {
    listenEventType,
    clearEvents,
    attachDocument,
    dispatchEvent
} = EventMatrix();

let bindEvents = (node, eventMap) => {
    // hook event at node
    node[eventMapHook] = eventMap;

    for (let type in eventMap) {
        listenEventType(type);
    }
};

module.exports = {
    bindEvents,
    attachDocument,
    dispatchEvent,
    clearEvents
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(31);

/**
 * @readme-doc
 *
 * ## features
 *
 * - simple DOM DSL, construct dom tree quickly
 *
 * - data-driven view, include updating view by data
 *
 * - Just functions, easy to compose
 *
 * [readme-lang:zh]## 特征
 *
 * - 简单的DOM DSL，快速构建DOM结构
 *
 * - 数据驱动视图，包括通过数据更新视图
 *
 * - 以函数为核心，易于复合
 *
 */

/**
 * @readme-quick-run
 *
 * Using method n to construct dom node quickly.
 *
 * [readme-lang:zh]用方法n快速构造dom节点
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {n, mount} = kabanery;
 *
 * mount(n('div', {
 *   id: 'qu',
 *   style: {
 *      backgroundColor: 'red'
 *   }
 * }, [
 *      n('span class=go style="font-size:16px"', 'hello!')
 * ]), document.body);
 *
 * console.log(document.getElementById('qu').outerHTML); // print result
 */

/**
 * @readme-quick-run
 *
 * Basic way to construct a view.
 *
 * [readme-lang:zh]构造一个组件的简单方法
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data) => {
 *      let {type} = data;
 *
 *      return n('div', {
 *         id: 'test1',
 *         style: {
 *            fontSize: 10
 *         }
 *      },[
 *          type === 2 && n('span', 'second'),
 *          type === 3 && n('div', 'third')
 *      ]);
 * });
 *
 * mount(MyView({type: 3}), document.body);
 *
 * console.log(document.getElementById('test1').outerHTML); // print result
 */

/**
 * @readme-quick-run
 *
 * Using update api to update a view.
 *
 * [readme-lang:zh]运用update api去更新一个view
 *
 * ## test tar=js r_c=kabanery env=browser
 * let {view, n, mount} = kabanery;
 *
 * let MyView = view((data, {update}) => {
 *      return n('div', {
 *         id: 'a',
 *         style: {
 *            fontSize: 10
 *         },
 *         onclick: () => {
 *            update('show', !data.show);
 *         }
 *      }, [
 *          data.show && n('div', 'show text')
 *      ]);
 * });
 *
 * mount(MyView({show: false}), document.body);
 *
 * document.getElementById('a').click(); // simulate user action
 * console.log(document.getElementById('a').outerHTML); // print result
 */


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
} = __webpack_require__(0);

/**
 *
 * preidcate: chose items to iterate
 * limit: when to stop iteration
 * transfer: transfer item
 * output
 */
let iterate = funType((domain = [], opts = {}) => {
    let {
        predicate, transfer, output, limit, def
    } = opts;

    opts.predicate = predicate || truthy;
    opts.transfer = transfer || id;
    opts.output = output || toList;
    if (limit === undefined) limit = domain && domain.length;
    limit = opts.limit = stopCondition(limit);

    let rets = def;
    let count = 0;

    if (likeArray(domain)) {
        for (let i = 0; i < domain.length; i++) {
            let itemRet = iterateItem(domain, i, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    } else if (isObject(domain)) {
        for (let name in domain) {
            let itemRet = iterateItem(domain, name, count, rets, opts);
            rets = itemRet.rets;
            count = itemRet.count;
            if (itemRet.stop) return rets;
        }
    }

    return rets;
}, [
    or(isObject, isFunction, isFalsy),
    or(isUndefined, mapType({
        predicate: or(isFunction, isFalsy),
        transfer: or(isFunction, isFalsy),
        output: or(isFunction, isFalsy),
        limit: or(isUndefined, isNumber, isFunction)
    }))
]);

let iterateItem = (domain, name, count, rets, {
    predicate, transfer, output, limit
}) => {
    let item = domain[name];
    if (limit(rets, item, name, domain, count)) {
        // stop
        return {
            stop: true,
            count,
            rets
        };
    }

    if (predicate(item)) {
        rets = output(rets, transfer(item, name, domain, rets), name, domain);
        count++;
    }
    return {
        stop: false,
        count,
        rets
    };
};

let stopCondition = (limit) => {
    if (isUndefined(limit)) {
        return falsy;
    } else if (isNumber(limit)) {
        return (rets, item, name, domain, count) => count >= limit;
    } else {
        return limit;
    }
};

let toList = (prev, v) => {
    prev.push(v);
    return prev;
};

let truthy = () => true;

let falsy = () => false;

let id = v => v;

module.exports = iterate;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString,
    isObject
} = __webpack_require__(0);

module.exports = (attr = '', {
    keyWrapper,
    valueWrapper
} = {}) => {
    if (isString(attr)) {
        return attr;
    }

    if (!isObject(attr)) {
        throw new TypeError(`Expect object for style object, but got ${attr}`);
    }
    let styles = [];
    for (let key in attr) {
        let value = attr[key];
        key = convertStyleKey(key);
        value = convertStyleValue(value, key);
        if (keyWrapper) {
            key = keyWrapper(key, value);
        }

        if (valueWrapper) {
            value = valueWrapper(value, key);
        }

        styles.push(`${key}: ${value};`);
    }
    return styles.join('');
};

let convertStyleKey = (key) => {
    return key.replace(/[A-Z]/, (letter) => {
        return `-${letter.toLowerCase()}`;
    });
};

let convertStyleValue = (value, key) => {
    if (typeof value === 'number' && key !== 'z-index') {
        return value + 'px';
    }
    if (key === 'padding' || key === 'margin') {
        let parts = value.split(' ');
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            if (!isNaN(Number(part))) {
                parts[i] = part + 'px';
            }
        }

        value = parts.join(' ');
    }
    return value;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    attachDocument
} = __webpack_require__(11);

let {
    isNode
} = __webpack_require__(0);

let {
    flat, forEach
} = __webpack_require__(1);

let reduceNode = __webpack_require__(10);

/**
 * @param parentNode
 *      the dom node used hook node we rendered
 */
module.exports = (kabaneryRoots, parentNode) => {
    kabaneryRoots = flat(kabaneryRoots);

    forEach(kabaneryRoots, (item) => {
        item = reduceNode(item);
        if (isNode(item)) {
            parentNode.appendChild(item);
        }
    });

    // attach to document
    attachDocument(getDoc(parentNode));
};

let getDoc = (node) => {
    while (node.parentNode) {
        node = node.parentNode;
    }
    return node;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(44);
exports.encode = exports.stringify = __webpack_require__(45);


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString,
    isObject
} = __webpack_require__(0);

module.exports = (attr = '', {
    keyWrapper,
    valueWrapper
} = {}) => {
    if (isString(attr)) {
        return attr;
    }

    if (!isObject(attr)) {
        throw new TypeError(`Expect object for style object, but got ${attr}`);
    }
    let styles = [];
    for (let key in attr) {
        let value = attr[key];
        key = convertStyleKey(key);
        value = convertStyleValue(value, key);
        if (keyWrapper) {
            key = keyWrapper(key, value);
        }

        if (valueWrapper) {
            value = valueWrapper(value, key);
        }

        styles.push(`${key}: ${value};`);
    }
    return styles.join('');
};

let convertStyleKey = (key) => {
    return key.replace(/[A-Z]/, (letter) => {
        return `-${letter.toLowerCase()}`;
    });
};

let convertStyleValue = (value, key) => {
    if (typeof value === 'number' && key !== 'z-index') {
        return value + 'px';
    }
    if (key === 'padding' || key === 'margin') {
        let parts = value.split(' ');
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            if (!isNaN(Number(part))) {
                parts[i] = part + 'px';
            }
        }

        value = parts.join(' ');
    }
    return value;
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    attachDocument
} = __webpack_require__(15);

let {
    isNode
} = __webpack_require__(0);

let {
    flat, forEach
} = __webpack_require__(1);

let reduceNode = __webpack_require__(14);

/**
 * @param parentNode
 *      the dom node used hook node we rendered
 */
module.exports = (kabaneryRoots, parentNode) => {
    kabaneryRoots = flat(kabaneryRoots);

    forEach(kabaneryRoots, (item) => {
        item = reduceNode(item);
        if (isNode(item)) {
            parentNode.appendChild(item);
        }
    });

    // attach to document
    attachDocument(getDoc(parentNode));
};

let getDoc = (node) => {
    while (node.parentNode) {
        node = node.parentNode;
    }
    return node;
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(6);
let lumineView = __webpack_require__(2);
let {
    styles
} = __webpack_require__(3);

module.exports = lumineView(({
    props,
    children
}) => {
    return n('div', {
        style: props.style
    }, children);
}, {
    defaultProps: {
        style: (theme) => styles(theme.fullParent)
    },

    defaultChildren: ['']
});


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = {
    MODE_PILE: 'pile',
    MODE_PERCENTAGE: 'percentage'
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let requestor = (apiPath = '/api/pfc') => (pfcCode) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    let {
                        errno,
                        errMsg,
                        data
                    } = JSON.parse(xhr.responseText);
                    if (errno === 0) {
                        resolve(data);
                    } else {
                        reject(new Error((errMsg.split(':')[1] || '').trim()));
                    }
                } else {
                    reject(new Error(`status code is ${xhr.status}`));
                }
            }
        };

        xhr.open('post', apiPath);
        xhr.send(pfcCode);
    });
};

module.exports = requestor;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let spa = __webpack_require__(27);
let {
    n,
    mount
} = __webpack_require__(16);

let debugPage = __webpack_require__(46);
let {
    apiMap,
    runApi
} = __webpack_require__(80);

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


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(28);

/**
 * @readme-quick-run
 *
 * ## test tar=js env=browser r_c=spa
 *
 * let {router, queryPager} = spa;
 * let {n, mount} = require('kabanery');
 * mount(n('div id="pager"'), document.body); // pager as contauner
 *
 * let {forward} = router(queryPager({
 *      'page1': {
 *          title: 'page1',
 *          render: () => {
 *              return n('div', 'this is page1');
 *          }
 *      },
 *      'page2': {
 *          render: () => {
 *              return n('div', 'this is page2');
 *          }
 *      }
 * }, 'page1')); // default page is page1
 *
 * module.exports = forward(window.location.href).then(() => {
 *    console.log('page 1 content: ');
 *    console.log(document.getElementById('pager').innerHTML);
 *    return forward('?page=page2').then(() => {
 *      console.log('\n\npage 2 content: ');
 *      console.log(document.getElementById('pager').innerHTML);
 *    });
 * });
 */


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    removeChilds
} = __webpack_require__(8);

let {
    mount
} = __webpack_require__(16);

let querystring = __webpack_require__(20);

const SINGLE_JUMP_PREFIX = 'single://';

const CONTAINER_ID = 'pager';

let queryPager = (map = [], index) => {
    index = initDefaultPage(map, index);

    return (url) => {
        let qs = querystring.parse(url.split('?')[1] || '');
        let pageName = qs.page || index;

        return map[pageName];
    };
};

let restPager = (map = [], index) => {
    index = initDefaultPage(map, index);

    return (url) => {
        let pathname = url.split(/.*\:\/\//)[1];
        let pageName = pathname.split('/')[1];
        pageName = pageName || index;

        return map[pageName];
    };
};

let initDefaultPage = (map = [], index) => {
    if (index === null || index === undefined) {
        for (let name in map) {
            index = name;
            break;
        }
    }
    return index;
};

let renderPage = (render, pageEnv, title, containerId) => {
    return Promise.resolve(render(pageEnv, title)).then((pageNode) => {
        // TODO pager is the default container, make it configurable
        let pager = document.getElementById(containerId);
        // unload old page
        removeChilds(pager);
        // add new page
        mount(pageNode, pager);
        pager.style = 'display:block;';
        document.title = title;

        // hash location
        if (window.location.hash) {
            let item = document.getElementById(window.location.hash.substring(1));
            if (item) {
                window.scrollTo(0, item.offsetTop);
            }
        }
    });
};

/**
 * pager: (url) => {title, render}
 */
let router = (pager, pageEnv, {
    onSwitchPageStart,
    onSwitchPageFinished,
    containerId = CONTAINER_ID
} = {}) => {
    let listenFlag = false;

    /**
     * only entrance for switching pages
     */
    let switchPage = (render, pageEnv, title) => {
        onSwitchPageStart && onSwitchPageStart(render, pageEnv, title);
        let ret = switchBetweenPages(render, pageEnv, title);

        Promise.resolve(ret).then((data) => {
            onSwitchPageFinished && onSwitchPageFinished(null, data);
        }).catch((err) => {
            onSwitchPageFinished && onSwitchPageFinished(err);
        });

        return ret;
    };

    let switchBetweenPages = (render, pageEnv, title) => {
        let ret = renderPage(render, pageEnv, title, containerId);

        if (!listenFlag) {
            listenPageSwitch();
            listenFlag = true;
        }

        return ret;
    };

    let forward = (url, {
        keepLocation
    } = {}) => {
        if (!window.history.pushState) {
            window.location.href = url;
            return;
        }
        let {
            render, title = '', transitionData = {}
        } = pager(url);

        if (url !== window.location.href) {
            window.history.pushState(transitionData, title, url);
        }
        if (!keepLocation) {
            window.scrollTo(0, 0);
        }
        return switchPage(render, pageEnv, title);
    };

    let redirect = (url) => {
        if (!window.history.pushState) {
            window.location.href = url;
            window.location.replace(url);
            return;
        }
        let {
            render, title = '', transitionData = {}
        } = pager(url);

        if (url !== window.location.href) {
            window.history.replaceState(transitionData, title, url);
        }
        return switchPage(render, pageEnv);
    };

    let listenPageSwitch = () => {
        window.onpopstate = () => {
            forward(window.location.href);
        };

        document.addEventListener('click', (e) => {
            // hack kabanery, TODO fix this hack
            setTimeout(() => {
                let target = e.target;
                // hack kabanery, TODO fix this hack
                if (e.__stopPropagation) return;

                while (target) {
                    if (target.getAttribute) { // document does not have getAttribute method
                        let url = (target.getAttribute('href') || '').trim();
                        // matched
                        if (url.indexOf(SINGLE_JUMP_PREFIX) === 0) {
                            e.preventDefault();
                            e.stopPropagation();

                            forward(url.substring(SINGLE_JUMP_PREFIX.length).trim());
                            break;
                        }
                    }
                    target = target.parentNode;
                }
            });
        });
    };

    return {
        forward,
        redirect,
        reload: () => {
            return forward(window.location.href, {
                keepLocation: true
            });
        }
    };
};

module.exports = {
    router,
    queryPager,
    restPager
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let shadowFrame = () => {
    let div = document.createElement('div');
    let sr = div.createShadowRoot();
    sr.innerHTML = '<div id="shadow-page"></div>';

    let frame = null;

    let create = () => {
        let html = document.getElementsByTagName('html')[0];
        html.appendChild(div);

        return sr.getElementById('shadow-page');
    };

    let start = () => {
        if (frame) {
            return frame;
        }
        frame = new Promise(resolve => {
            if (document.body) {
                resolve(create());
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    resolve(create());
                });
            }
        });
        return frame;
    };

    let close = () => {
        frame.then(() => {
            let parent = div.parentNode;
            parent && parent.removeChild(div);
        });
    };

    return {
        start,
        close,
        sr,
        rootDiv: div
    };
};

module.exports = shadowFrame;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let isDomReady = (doc) => doc.readyState === 'complete' ||
    (!doc.attachEvent && doc.readyState === 'interactive');

let startMomenter = (doc = document) => {
    let loadedFlag = false;

    let resolves = [];

    let docReady = () => {
        let ready = () => {
            if (loadedFlag) return;
            loadedFlag = true;
            for (let i = 0; i < resolves.length; i++) {
                resolves[i]();
            }
            resolves = [];
        };
        if (doc.addEventListener) {
            doc.addEventListener('DOMContentLoaded', ready);
            doc.addEventListener('DOMContentLoaded', ready);
        } else {
            doc.attachEvent('onreadystatechange', () => {
                if (document.readyState === 'complete') {
                    ready();
                }
            });
        }
    };

    docReady();

    // generalWaitTime is used for async rendering
    return ({
        generalWaitTime = 0, startTimeout = 10000
    } = {}) => new Promise((resolve, reject) => {
        if (loadedFlag || isDomReady(doc)) { // already ready
            setTimeout(resolve, generalWaitTime);
        } else { // wait for ready
            resolves.push(resolve);
            setTimeout(() => {
                reject(new Error('timeout'));
            }, startTimeout);
        }
    });
};

module.exports = startMomenter;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n, svgn, bindPlugs, toHTML, parseArgs, isKabaneryNode, cn, parseStyle
} = __webpack_require__(9);

let plugs = __webpack_require__(35);

let view = __webpack_require__(38);

let mount = __webpack_require__(19);

let N = __webpack_require__(43);

let reduceNode = __webpack_require__(10);

let {dispatchEvent} = __webpack_require__(11);

module.exports = {
    n,
    isKabaneryNode,
    cn,
    N,
    svgn,
    view,
    plugs,
    bindPlugs,
    mount,
    toHTML,
    reduceNode,

    parseArgs,
    parseStyle,
    dispatchEvent
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let iterate = __webpack_require__(17);

let defauls = {
    eq: (v1, v2) => v1 === v2
};

let setDefault = (opts, defauls) => {
    for (let name in defauls) {
        opts[name] = opts[name] || defauls[name];
    }
};

let forEach = (list, handler) => iterate(list, {
    limit: (rets) => {
        if (rets === true) return true;
        return false;
    },
    transfer: handler,
    output: (prev, cur) => cur,
    def: false
});

let map = (list, handler, limit) => iterate(list, {
    transfer: handler,
    def: [],
    limit
});

let reduce = (list, handler, def, limit) => iterate(list, {
    output: handler,
    def,
    limit
});

let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
    handler && handler(cur, index, list) && prev.push(cur);
    return prev;
}, [], limit);

let find = (list, item, fopts) => {
    let index = findIndex(list, item, fopts);
    if (index === -1) return undefined;
    return list[index];
};

let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev && originLogic(curLogic);
}, true, falsyIt);

let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
    let curLogic = handler && handler(cur, index, list);
    return prev || originLogic(curLogic);
}, false, originLogic);

let findIndex = (list, item, fopts = {}) => {
    setDefault(fopts, defauls);

    let {
        eq
    } = fopts;
    let predicate = (v) => eq(item, v);
    let ret = iterate(list, {
        transfer: indexTransfer,
        limit: onlyOne,
        predicate,
        def: []
    });
    if (!ret.length) return -1;
    return ret[0];
};

let compact = (list) => reduce(list, (prev, cur) => {
    if (cur) prev.push(cur);
    return prev;
}, []);

let indexTransfer = (item, index) => index;

let onlyOne = (rets, item, name, domain, count) => count >= 1;

let falsyIt = v => !v;

let originLogic = v => !!v;

module.exports = {
    map,
    forEach,
    reduce,
    find,
    findIndex,
    filter,
    any,
    exist,
    compact
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let parseAttribute = __webpack_require__(34);

let {
    isString, isObject, isNode, likeArray, isNumber, isBool
} = __webpack_require__(0);

let parseArgs = (args) => {
    let tagName,
        attributes = {},
        childExp = [];

    let first = args.shift();

    let parts = splitTagNameAttribute(first);

    if (parts.length > 1) { // not only tagName
        tagName = parts[0];
        attributes = parts[1];
    } else {
        tagName = first;
    }

    tagName = tagName.toLowerCase().trim();

    let next = args.shift();

    let nextAttr = {};

    if (likeArray(next) ||
        isString(next) ||
        isNode(next) ||
        isNumber(next) ||
        isBool(next)) {
        childExp = next;
    } else if (isObject(next)) {
        nextAttr = next;
        childExp = args.shift() || [];
    }

    attributes = parseAttribute(attributes, nextAttr);

    let childs = parseChildExp(childExp);

    return {
        tagName,
        attributes,
        childs
    };
};

let splitTagNameAttribute = (str = '') => {
    let tagName = str.split(' ')[0];
    let attr = str.substring(tagName.length);
    attr = attr && attr.trim();
    if (attr) {
        return [tagName, attr];
    } else {
        return [tagName];
    }
};

let parseChildExp = (childExp) => {
    let ret = [];
    if (isNode(childExp)) {
        ret.push(childExp);
    } else if (likeArray(childExp)) {
        for (let i = 0; i < childExp.length; i++) {
            let child = childExp[i];
            ret = ret.concat(parseChildExp(child));
        }
    } else if (childExp) {
        ret.push(childExp);
    }
    return ret;
};

module.exports = parseArgs;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString
} = __webpack_require__(0);

let parseStyle = __webpack_require__(18);

let {
    mergeMap
} = __webpack_require__(1);

const ITEM_REG = /([\w-]+)\s*=\s*(([\w-]+)|('.*?')|(".*?"))/;

// TODO better key=value grammer
// TODO refactor with grammerL: class grammer, id grammer, refer some popular grammer
let parseAttribute = (attributes, nextAttr) => {
    // key=value key=value
    // value='abc' value=true value=123 value="def"
    if (isString(attributes)) {
        let str = attributes.trim(),
            kvs = [];

        let stop = false;
        while (!stop) {
            let newstr = str.replace(ITEM_REG, (matchStr, $1, $2) => {
                kvs.push([$1, $2]);
                return '';
            }).trim();
            if (newstr === str) {
                stop = true;
            }
            str = newstr;
        }

        attributes = {};
        for (let i = 0; i < kvs.length; i++) {
            let [key, value] = kvs[i];
            if (value[0] === '\'' && value[value.length - 1] === '\'' ||
                value[0] === '"' && value[value.length - 1] === '"') {
                value = value.substring(1, value.length - 1);
            }
            attributes[key] = value;
        }
    }
    // merge
    attributes = mergeMap(attributes, nextAttr);

    if (attributes.style) {
        attributes.style = parseStyle(attributes.style);
    }

    // TODO presudo
    /*
    if (attributes.presudo) {
        for (let name in attributes.presudo) {
            attributes.presudo[name] = parseStyle(attributes.presudo[name]);
        }
    }
   */

    return attributes;
};

module.exports = parseAttribute;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let twowaybinding = __webpack_require__(36);
let eventError = __webpack_require__(37);

module.exports = {
    twowaybinding,
    eventError
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    get, set
} = __webpack_require__(5);

module.exports = (obj, path) => (tagName, attributes, childExp) => {
    let value = get(obj, path, '');
    if (tagName === 'input') {
        attributes.value = value;
    } else {
        childExp.unshift(value);
    }

    if (!attributes.oninput) {
        attributes.oninput = (e) => {
            set(obj, path, e.target.value);
        };
    }
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (catcher) => (tagName, attributes) => {
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            if (typeof item === 'function') {
                attributes[name] = wrapEventHandler(item, catcher);
            }
        }
    }
};

let wrapEventHandler = (fun, catcher) => {
    return function () {
        try {
            let ret = fun.apply(this, arguments);
            ret = Promise.resolve(ret);
            ret.catch(catcher);
            return ret;
        } catch (err) {
            return catcher(err);
        }
    };
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    set
} = __webpack_require__(5);

let {
    isObject,
    isFunction,
    likeArray
} = __webpack_require__(0);

let {
    forEach
} = __webpack_require__(1);

let replace = __webpack_require__(39);

let reduceNode = __webpack_require__(10);

let mount = __webpack_require__(19);

/**
 * render function: (data) => node
 */

// TODO observable for update, append

// class level
let View = (view, construct, {
    afterRender
} = {}) => {
    // TODO class level API
    // instance level
    let viewer = (obj, initor) => {
        // create context
        let ctx = createCtx({
            view,
            afterRender
        });

        return createView(ctx, obj, initor, construct);
    };

    let viewerOps = (viewer) => {
        viewer.create = (handler) => {
            let ctx = createCtx({
                view,
                afterRender
            });

            handler && handler(ctx);

            let inst = (obj, initor) => {
                return createView(ctx, obj, initor, construct);
            };

            inst.ctx = ctx;

            return inst;
        };

        // extend some context
        viewer.expand = (ctxMap = {}) => {
            let newViewer = (...args) => {
                let obj = args[0];
                args[0] = View.ext(obj, ctxMap);

                return viewer(...args);
            };

            viewerOps(newViewer);
            return newViewer;
        };
    };

    viewerOps(viewer);

    return viewer;
};

View.ext = (data, ctxMap = {}) => (ctx) => {
    for (let name in ctxMap) {
        ctx[name] = ctxMap[name];
    }
    if (isFunction(data)) {
        return data(ctx);
    }
    return data;
};

let createView = (ctx, obj, initor, construct) => {
    let data = ctx.initData(obj, ctx);
    // only run initor when construct view
    initor && initor(data, ctx);
    construct && construct(data, ctx);

    // render node
    return ctx.replaceView();
};

let createCtx = ({
    view,
    afterRender
}) => {
    let node = null,
        data = null,
        render = null;

    let update = (...args) => {
        updateData(...args);
        return replaceView();
    };

    let updateData = (...args) => {
        if (args.length === 1 && likeArray(args[0])) {
            let arg = args[0];
            forEach(arg, (item) => {
                set(data, item[0], item[1]);
            });
        } else {
            let [path, value] = args;

            // function is a special data
            if (isFunction(value)) {
                value = value(data);
            }

            set(data, path, value);
        }
    };

    let appendView = (itemView) => {
        if (node) {
            mount(itemView, node);
        }
    };

    let replaceView = () => {
        let newNode = getNewNode();
        newNode = reduceNode(newNode);

        // type check for newNode

        node = replace(node, newNode);

        afterRender && afterRender(ctx);

        if (node) node.ctx = ctx;
        return node;
    };

    let getNewNode = () => {
        if (!render) render = view;
        let ret = render(data, ctx);
        if (isFunction(ret)) {
            render = ret;
            return render(data, ctx);
        } else {
            return ret;
        }
    };

    let initData = (obj = {}) => {
        data = generateData(obj, ctx);
        return data;
    };

    let getNode = () => node;

    let getData = () => data;

    let getCtx = () => ctx;

    // TODO refator
    let transferCtx = (newNode) => {
        node = newNode;
        newNode.ctx = ctx;
    };

    let ctx = {
        update,
        updateData,
        getNode,
        getData,
        transferCtx,
        initData,
        replaceView,
        appendView,
        getCtx
    };

    return ctx;
};

let generateData = (obj, ctx) => {
    let data = null;
    // data generator
    if (isFunction(obj)) {
        data = obj(ctx);
    } else {
        data = obj;
    }

    // TODO need mount event
    if (!isObject(data)) {
        throw new TypeError(`Expect object, but got ${data}. Type is ${typeof data}`);
    }
    return data;
};

module.exports = View;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    toArray
} = __webpack_require__(5);

let {
    isNode
} = __webpack_require__(0);

let {
    forEach
} = __webpack_require__(1);

let applyAttibutes = __webpack_require__(40);

let replaceDirectly = (node, newNode) => {
    let parent = node.parentNode;
    if (parent) {
        // replace
        parent.replaceChild(newNode, node);
        return newNode;
    } else {
        return node;
    }
};

let removeOldNode = (oldNode) => {
    let parent = oldNode.parentNode;
    if (parent) {
        parent.removeChild(oldNode);
    }
};

// TODO using key
let diffNode = (node, newNode) => {
    if (!newNode) {
        return removeOldNode(node);
    }

    if (node.nodeType === 3 && newNode.nodeType === 3) {
        node.textContent = newNode.textContent;
    }

    if (isNode(node) && isNode(newNode)) {
        if (node.nodeType === 3 && newNode.nodeType === 3) {
            node.textContent = newNode.textContent;
            return node;
        }

        if (node.tagName !== newNode.tagName ||
            node.tagName === 'INPUT'
        ) {
            // TODO problems performance
            // TODO nodetype problem
            return replaceDirectly(node, newNode);
        } else {
            editNode(node, newNode);
        }
    }
    return node;
};

let editNode = (node, newNode) => {
    // attributes
    applyAttibutes(node, newNode);

    // transfer context
    if (newNode.ctx) {
        newNode.ctx.transferCtx(node);
    }

    // transfer event map
    if (newNode.__eventMap) {
        node.__eventMap = newNode.__eventMap;
    }

    let orinChildNodes = toArray(node.childNodes);
    let newChildNodes = toArray(newNode.childNodes);

    // TODO using key
    convertLists(orinChildNodes, newChildNodes, node);
};

let convertLists = (orinChildNodes, newChildNodes, parent) => {
    removeExtra(orinChildNodes, newChildNodes);

    // diff
    forEach(orinChildNodes, (orinChild, i) => {
        diffNode(orinChild, newChildNodes[i]);
    });

    appendMissing(orinChildNodes, newChildNodes, parent);
    return orinChildNodes;
};

let removeExtra = (orinChildNodes, newChildNodes) => {
    // remove
    for (let i = newChildNodes.length; i < orinChildNodes.length; i++) {
        removeOldNode(orinChildNodes[i]);
    }
};

let appendMissing = (orinChildNodes, newChildNodes, parent) => {
    // append
    for (let i = orinChildNodes.length; i < newChildNodes.length; i++) {
        let newChild = newChildNodes[i];
        parent.appendChild(newChild);
    }
};

module.exports = (node, newNode) => {
    let ret = null;

    if (!node) {
        ret = newNode;
    } else if (!newNode) {
        removeOldNode(node);
        ret = null;
    } else {
        ret = diffNode(node, newNode);
    }

    return ret;
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    getAttributeMap
} = __webpack_require__(8);

let {
    hasOwnProperty
} = __webpack_require__(5);

let {
    forEach
} = __webpack_require__(1);

let applyAttibutes = (node, newNode) => {
    // attributes
    let orinAttrMap = getAttributeMap(node.attributes);
    let newAttrMap = getAttributeMap(newNode.attributes);

    // update and remove
    forEach(orinAttrMap, (orinValue, name) => {
        if (hasOwnProperty(newAttrMap, name)) {
            let newValue = newAttrMap[name];
            if (newValue !== orinValue) {
                node.setAttribute(name, newValue);
            }
        } else {
            node.removeAttribute(name);
        }
    });

    // append
    forEach(newAttrMap, (newAttr, name) => {
        if (!hasOwnProperty(orinAttrMap, name)) {
            node.setAttribute(name, newAttr);
        }
    });
};

module.exports = applyAttibutes;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isNode
} = __webpack_require__(0);

const svgNS = 'http://www.w3.org/2000/svg';

let applyNode = (node, attributes, childs) => {
    for (let name in attributes) {
        let attr = attributes[name];
        node.setAttribute(name, attr);
    }

    for (let i = 0; i < childs.length; i++) {
        let child = childs[i];
        if (isNode(child)) {
            node.appendChild(child);
        } else {
            node.textContent = child + '';
        }
    }
};

let createElement = (tagName, attributes, childs) => {
    let node = document.createElement(tagName);
    applyNode(node, attributes, childs);
    return node;
};

let createSvgElement = (tagName, attributes, childs) => {
    let node = document.createElementNS(svgNS, tagName);
    applyNode(node, attributes, childs);
    return node;
};

module.exports = {
    createElement,
    createSvgElement
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    contain
} = __webpack_require__(1);

module.exports = () => {
    let docs = [];
    let eventTypeMap = {};
    let handlerMap = {};

    let listenEventType = (type) => {
        if (!eventTypeMap[type]) {
            updateDocs(type);
        }
        eventTypeMap[type] = true;
    };

    /**
     * attach document used to accept events
     */
    let attachDocument = (doc = document) => {
        if (!contain(docs, doc)) {
            for (let type in eventTypeMap) {
                // prevent multiple version of kabanery to binding multiple times
                let id = getGlobalEventTypeId(type);
                if (!doc[id]) {
                    addEventListenerToDoc(doc, type);
                    doc[id] = true;
                }
            }
            docs.push(doc);
        }
    };

    let updateDocs = (type) => {
        if (!docs.length) {
            docs.push(document);
        }
        for (let i = 0; i < docs.length; i++) {
            let doc = docs[i];
            addEventListenerToDoc(doc, type);
        }
    };

    let addEventListenerToDoc = (doc, type) => {
        let handler = null;
        if (handlerMap[type]) {
            handler = handlerMap[type];
        } else {
            handler = listener(type);
            handlerMap[type] = handler;
        }
        doc.addEventListener(type, handler);
    };

    /**
     * e = {
     *  target,
     *  stopPropagation [optional]
     * }
     */
    let listener = (type) => function(e) {
        let ctx = this;
        let target = e.target;

        // hack the stopPropagration function
        let oldProp = e.stopPropagation;
        e.stopPropagation = function(...args) {
            e.__stopPropagation = true;
            return oldProp && oldProp.apply(this, args);
        };

        let nodePath = getNodePath(target);

        for (let i = 0; i < nodePath.length; i++) {
            let node = nodePath[i];
            applyNodeHandlers(e, type, node, ctx);
        }
    };

    let applyNodeHandlers = (e, type, node, ctx) => {
        if (e.__stopPropagation) { // event already been stoped by child node
            return true;
        }

        let handler = getHandler(type, node);
        return handler && handler.apply(ctx, [e]);
    };

    let getHandler = (type, target) => {
        let eventMap = target && target.__eventMap;
        return eventMap && eventMap[type];
    };

    let dispatchEvent = (type, e) => {
        let handler = handlerMap[type];
        handler && handler(e);
    };

    return {
        listenEventType,
        attachDocument,
        dispatchEvent
    };
};

/**
 * get the path of node
 */
let getNodePath = (target) => {
    let paths = [];
    while (target) {
        paths.push(target);
        target = target.parentNode;
    }
    return paths;
};

let getGlobalEventTypeId = (type) => `__event_type_id_${type}`;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(9);

let {
    isArray, isFunction, isObject
} = __webpack_require__(0);

let {
    map
} = __webpack_require__(1);

module.exports = (...args) => {
    let tagName = args[0],
        attrs = {},
        childs = [];
    if (isArray(args[1])) {
        childs = args[1];
    } else if (isFunction(args[1])) {
        childs = [args[1]];
    } else {
        if (isObject(args[1])) {
            attrs = args[1];
            if (isArray(args[2])) {
                childs = args[2];
            } else if (isFunction(args[2])) {
                childs = [args[2]];
            }
        }
    }

    return (...params) => {
        let renderList = (list) => {
            return map(list, (viewer) => {
                if (isArray(viewer)) {
                    return renderList(viewer);
                } else if (isFunction(viewer)) {
                    return viewer(...params);
                } else {
                    return viewer;
                }
            });
        };

        return n(tagName, attrs, renderList(childs));
    };
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let lumineView = __webpack_require__(2);
let n = __webpack_require__(7);
let {
    syncBindWithKeyMap
} = __webpack_require__(65);
let {
    deliver,
    onSignalType
} = __webpack_require__(4);
let {
    loadingNoticeProgress
} = __webpack_require__(66);
let {
    wrapPagePropsWithStore
} = __webpack_require__(68);

let Vn = __webpack_require__(69);
let Hn = __webpack_require__(70);
let Input = __webpack_require__(71);
let Textarea = __webpack_require__(72);
let Button = __webpack_require__(73);
let PageLoading = __webpack_require__(74);
let Notice = __webpack_require__(79);

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


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n,
    svgn,
    bindPlugs,
    toHTML,
    parseArgs,
    isKabaneryNode,
    cn,
    parseStyle
} = __webpack_require__(12);

let plugs = __webpack_require__(50);

let view = __webpack_require__(53);

let mount = __webpack_require__(22);

let N = __webpack_require__(62);

let reduceNode = __webpack_require__(14);

let {
    dispatchEvent,
    clearEvents
} = __webpack_require__(15);

module.exports = {
    n,
    isKabaneryNode,
    cn,
    N,
    svgn,
    view,
    plugs,
    bindPlugs,
    mount,
    toHTML,
    reduceNode,

    parseArgs,
    parseStyle,
    dispatchEvent,
    clearEvents
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let parseAttribute = __webpack_require__(49);

let {
    isString,
    isObject,
    isNode,
    likeArray,
    isNumber,
    isBool
} = __webpack_require__(0);

let parseArgs = (args, {
    doParseStyle = true
} = {}) => {
    let tagName,
        attributes = {},
        childExp = [];

    let first = args.shift();

    let parts = splitTagNameAttribute(first);

    if (parts.length > 1) { // not only tagName
        tagName = parts[0];
        attributes = parts[1];
    } else {
        tagName = first;
    }

    let next = args.shift();

    let nextAttr = {};

    if (likeArray(next) ||
        isString(next) ||
        isNode(next) ||
        isNumber(next) ||
        isBool(next)) {
        childExp = next;
    } else if (isObject(next)) {
        nextAttr = next;
        childExp = args.shift() || [];
    }

    attributes = parseAttribute(attributes, nextAttr, {
        doParseStyle
    });

    let childs = parseChildExp(childExp);

    return {
        tagName,
        attributes,
        childs
    };
};

let splitTagNameAttribute = (str = '') => {
    if (typeof str !== 'string') return [str];

    let tagName = str.split(' ')[0];
    let attr = str.substring(tagName.length);
    attr = attr && attr.trim();

    tagName = tagName.toLowerCase().trim();
    if (attr) {
        return [tagName, attr];
    } else {
        return [tagName];
    }
};

let parseChildExp = (childExp) => {
    let ret = [];
    if (isNode(childExp)) {
        ret.push(childExp);
    } else if (likeArray(childExp)) {
        for (let i = 0; i < childExp.length; i++) {
            let child = childExp[i];
            ret = ret.concat(parseChildExp(child));
        }
    } else if (childExp) {
        ret.push(childExp);
    }
    return ret;
};

module.exports = parseArgs;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isString
} = __webpack_require__(0);

let parseStyle = __webpack_require__(21);

let {
    mergeMap
} = __webpack_require__(1);

const ITEM_REG = /([\w-]+)\s*=\s*(([\w-]+)|('.*?')|(".*?"))/;

// TODO better key=value grammer
// TODO refactor with grammerL: class grammer, id grammer, refer some popular grammer
let parseAttribute = (attributes, nextAttr, {
    doParseStyle
}) => {
    // key=value key=value
    // value='abc' value=true value=123 value="def"
    if (isString(attributes)) {
        let str = attributes.trim(),
            kvs = [];

        let stop = false;
        while (!stop) {
            let newstr = str.replace(ITEM_REG, (matchStr, $1, $2) => {
                kvs.push([$1, $2]);
                return '';
            }).trim();
            if (newstr === str) {
                stop = true;
            }
            str = newstr;
        }

        attributes = {};
        for (let i = 0; i < kvs.length; i++) {
            let [key, value] = kvs[i];
            if (value[0] === '\'' && value[value.length - 1] === '\'' ||
                value[0] === '"' && value[value.length - 1] === '"') {
                value = value.substring(1, value.length - 1);
            }
            attributes[key] = value;
        }
    }
    // merge
    attributes = mergeMap(attributes, nextAttr);

    if (attributes.style && doParseStyle) {
        attributes.style = parseStyle(attributes.style);
    }

    // TODO presudo
    /*
    if (attributes.presudo) {
        for (let name in attributes.presudo) {
            attributes.presudo[name] = parseStyle(attributes.presudo[name]);
        }
    }
   */

    return attributes;
};

module.exports = parseAttribute;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let twowaybinding = __webpack_require__(51);
let eventError = __webpack_require__(52);

module.exports = {
    twowaybinding,
    eventError
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    get, set
} = __webpack_require__(5);

module.exports = (obj, path) => (tagName, attributes, childExp) => {
    let value = get(obj, path, '');
    if (tagName === 'input') {
        attributes.value = value;
    } else {
        childExp.unshift(value);
    }

    if (!attributes.oninput) {
        attributes.oninput = (e) => {
            set(obj, path, e.target.value);
        };
    }
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (catcher) => (tagName, attributes) => {
    for (let name in attributes) {
        let item = attributes[name];
        if (name.indexOf('on') === 0) {
            if (typeof item === 'function') {
                attributes[name] = wrapEventHandler(item, catcher);
            }
        }
    }
};

let wrapEventHandler = (fun, catcher) => {
    return function () {
        try {
            let ret = fun.apply(this, arguments);
            ret = Promise.resolve(ret);
            ret.catch(catcher);
            return ret;
        } catch (err) {
            return catcher(err);
        }
    };
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    set
} = __webpack_require__(5);

let {
    isObject,
    isFunction,
    likeArray
} = __webpack_require__(0);

let {
    forEach
} = __webpack_require__(1);

let replace = __webpack_require__(54);

let reduceNode = __webpack_require__(14);

let mount = __webpack_require__(22);

/**
 * render function: (data) => node
 */

// TODO observable for update, append

// class level
let View = (view, construct, {
    afterRender
} = {}) => {
    // TODO class level API
    // instance level
    let viewer = (obj, initor) => {
        // create context
        let ctx = createCtx({
            view,
            afterRender
        });

        return createView(ctx, obj, initor, construct);
    };

    let viewerOps = (viewer) => {
        viewer.create = (handler) => {
            let ctx = createCtx({
                view,
                afterRender
            });

            handler && handler(ctx);

            let inst = (obj, initor) => {
                return createView(ctx, obj, initor, construct);
            };

            inst.ctx = ctx;

            return inst;
        };

        // extend some context
        viewer.expand = (ctxMap = {}) => {
            let newViewer = (...args) => {
                let obj = args[0];
                args[0] = View.ext(obj, ctxMap);

                return viewer(...args);
            };

            viewerOps(newViewer);
            return newViewer;
        };
    };

    viewerOps(viewer);

    return viewer;
};

View.ext = (data, ctxMap = {}) => (ctx) => {
    for (let name in ctxMap) {
        ctx[name] = ctxMap[name];
    }
    if (isFunction(data)) {
        return data(ctx);
    }
    return data;
};

let createView = (ctx, obj, initor, construct) => {
    let data = ctx.initData(obj, ctx);
    // only run initor when construct view
    initor && initor(data, ctx);
    construct && construct(data, ctx);

    // render node
    return ctx.replaceView();
};

let createCtx = ({
    view,
    afterRender
}) => {
    let node = null,
        data = null,
        render = null;

    let update = (...args) => {
        updateData(...args);
        return replaceView();
    };

    let updateData = (...args) => {
        if (args.length === 1 && likeArray(args[0])) {
            let arg = args[0];
            forEach(arg, (item) => {
                set(data, item[0], item[1]);
            });
        } else {
            let [path, value] = args;

            // function is a special data
            if (isFunction(value)) {
                value = value(data);
            }

            set(data, path, value);
        }
    };

    let appendView = (itemView) => {
        if (node) {
            mount(itemView, node);
        }
    };

    let replaceView = () => {
        let newNode = getNewNode();
        newNode = reduceNode(newNode);

        // type check for newNode

        node = replace(node, newNode);

        afterRender && afterRender(ctx);

        if (node) node.ctx = ctx;
        return node;
    };

    let getNewNode = () => {
        if (!render) render = view;
        let ret = render(data, ctx);
        if (isFunction(ret)) {
            render = ret;
            return render(data, ctx);
        } else {
            return ret;
        }
    };

    let initData = (obj = {}) => {
        data = generateData(obj, ctx);
        return data;
    };

    let getNode = () => node;

    let getData = () => data;

    let getCtx = () => ctx;

    // TODO refator
    let transferCtx = (newNode) => {
        node = newNode;
        newNode.ctx = ctx;
    };

    let ctx = {
        update,
        updateData,
        getNode,
        getData,
        transferCtx,
        initData,
        replaceView,
        appendView,
        getCtx
    };

    return ctx;
};

let generateData = (obj, ctx) => {
    let data = null;
    // data generator
    if (isFunction(obj)) {
        data = obj(ctx);
    } else {
        data = obj;
    }

    // TODO need mount event
    if (!isObject(data)) {
        throw new TypeError(`Expect object, but got ${data}. Type is ${typeof data}`);
    }
    return data;
};

module.exports = View;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    toArray
} = __webpack_require__(5);

let {
    isNode
} = __webpack_require__(0);

let {
    forEach
} = __webpack_require__(1);

let {
    eventMapHook
} = __webpack_require__(13);

let applyAttibutes = __webpack_require__(59);

let replaceDirectly = (node, newNode) => {
    let parent = node.parentNode;
    if (parent) {
        // replace
        parent.replaceChild(newNode, node);
        return newNode;
    } else {
        return node;
    }
};

let removeOldNode = (oldNode) => {
    let parent = oldNode.parentNode;
    if (parent) {
        parent.removeChild(oldNode);
    }
};

// TODO using key
let diffNode = (node, newNode) => {
    if (!newNode) {
        return removeOldNode(node);
    }

    if (node.nodeType === 3 && newNode.nodeType === 3) {
        node.textContent = newNode.textContent;
    }

    if (isNode(node) && isNode(newNode)) {
        if (node.nodeType === 3 && newNode.nodeType === 3) {
            node.textContent = newNode.textContent;
            return node;
        }

        if (node.tagName !== newNode.tagName ||
            node.tagName === 'INPUT'
        ) {
            // TODO problems performance
            // TODO nodetype problem
            return replaceDirectly(node, newNode);
        } else {
            editNode(node, newNode);
        }
    }
    return node;
};

let editNode = (node, newNode) => {
    // attributes
    applyAttibutes(node, newNode);

    // transfer context
    if (newNode.ctx) {
        newNode.ctx.transferCtx(node);
    }

    // transfer event map
    if (newNode[eventMapHook]) {
        node[eventMapHook] = newNode[eventMapHook];
    }

    let orinChildNodes = toArray(node.childNodes);
    let newChildNodes = toArray(newNode.childNodes);

    // TODO using key
    convertLists(orinChildNodes, newChildNodes, node);
};

let convertLists = (orinChildNodes, newChildNodes, parent) => {
    removeExtra(orinChildNodes, newChildNodes);

    // diff
    forEach(orinChildNodes, (orinChild, i) => {
        diffNode(orinChild, newChildNodes[i]);
    });

    appendMissing(orinChildNodes, newChildNodes, parent);
    return orinChildNodes;
};

let removeExtra = (orinChildNodes, newChildNodes) => {
    // remove
    for (let i = newChildNodes.length; i < orinChildNodes.length; i++) {
        removeOldNode(orinChildNodes[i]);
    }
};

let appendMissing = (orinChildNodes, newChildNodes, parent) => {
    // append
    for (let i = orinChildNodes.length; i < newChildNodes.length; i++) {
        let newChild = newChildNodes[i];
        parent.appendChild(newChild);
    }
};

module.exports = (node, newNode) => {
    let ret = null;

    if (!node) {
        ret = newNode;
    } else if (!newNode) {
        removeOldNode(node);
        ret = null;
    } else {
        ret = diffNode(node, newNode);
    }

    return ret;
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(56);
var bytesToUuid = __webpack_require__(58);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(57)))

/***/ }),
/* 57 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 58 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    getAttributeMap
} = __webpack_require__(8);

let {
    hasOwnProperty
} = __webpack_require__(5);

let {
    forEach
} = __webpack_require__(1);

let applyAttibutes = (node, newNode) => {
    // attributes
    let orinAttrMap = getAttributeMap(node.attributes);
    let newAttrMap = getAttributeMap(newNode.attributes);

    // update and remove
    forEach(orinAttrMap, (orinValue, name) => {
        if (hasOwnProperty(newAttrMap, name)) {
            let newValue = newAttrMap[name];
            if (newValue !== orinValue) {
                node.setAttribute(name, newValue);
            }
        } else {
            node.removeAttribute(name);
        }
    });

    // append
    forEach(newAttrMap, (newAttr, name) => {
        if (!hasOwnProperty(orinAttrMap, name)) {
            node.setAttribute(name, newAttr);
        }
    });
};

module.exports = applyAttibutes;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isNode
} = __webpack_require__(0);

const svgNS = 'http://www.w3.org/2000/svg';

let applyNode = (node, attributes, childs) => {
    for (let name in attributes) {
        let attr = attributes[name];
        node.setAttribute(name, attr);
    }

    for (let i = 0; i < childs.length; i++) {
        let child = childs[i];
        if (isNode(child)) {
            node.appendChild(child);
        } else {
            node.textContent = child + '';
        }
    }
};

let createElement = (tagName, attributes, childs) => {
    let node = document.createElement(tagName);
    applyNode(node, attributes, childs);
    return node;
};

let createSvgElement = (tagName, attributes, childs) => {
    let node = document.createElementNS(svgNS, tagName);
    applyNode(node, attributes, childs);
    return node;
};

module.exports = {
    createElement,
    createSvgElement
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    contain
} = __webpack_require__(1);

let {
    eventMapHook,
    globalEventTypePrefix,
    stopPropagationFlag
} = __webpack_require__(13);

module.exports = () => {
    let docs = [];
    let eventTypeMap = {};
    let handlerMap = {};

    let listenEventType = (type) => {
        if (!eventTypeMap[type]) {
            updateDocs(type);
        }
        eventTypeMap[type] = true;
    };

    /**
     * attach document used to accept events
     */
    let attachDocument = (doc = document) => {
        if (!contain(docs, doc)) {
            for (let type in eventTypeMap) {
                // prevent multiple version of kabanery to binding multiple times for the same type
                let id = getGlobalEventTypeId(type);
                if (!doc[id]) {
                    addEventListenerToDoc(doc, type);
                    doc[id] = true;
                }
            }
            docs.push(doc);
        }
    };

    let updateDocs = (type) => {
        if (!docs.length) {
            docs.push(document);
        }
        for (let i = 0; i < docs.length; i++) {
            let doc = docs[i];
            addEventListenerToDoc(doc, type);
        }
    };

    let addEventListenerToDoc = (doc, type) => {
        let handler = null;
        if (handlerMap[type]) {
            handler = handlerMap[type];
        } else {
            handler = listener(type);
            handlerMap[type] = handler;
        }
        doc.addEventListener(type, handler);
    };

    let clearEvents = () => {
        for (let type in eventTypeMap) {
            removeListenerType(type);
        }
    };

    let removeListenerType = (type) => {
        let handler = handlerMap[type];
        if (handler) {
            for (let i = 0; i < docs.length; i++) {
                let doc = docs[i];
                doc.removeEventListener(type, handler);
            }
            delete handlerMap[type];
            delete eventTypeMap[type];
        }
    };

    let getDocs = () => docs.slice(0);

    /**
     * e = {
     *  target,
     *  stopPropagation [optional]
     * }
     */
    let listener = (type) => function(e) {
        let ctx = this;
        let target = e.target;

        // hack the stopPropagration function
        let oldProp = e.stopPropagation;
        e.stopPropagation = function(...args) {
            e[stopPropagationFlag] = true;
            return oldProp && oldProp.apply(this, args);
        };

        let nodePath = getNodePath(target);

        for (let i = 0; i < nodePath.length; i++) {
            let node = nodePath[i];
            applyNodeHandlers(e, type, node, ctx);
        }
    };

    let applyNodeHandlers = (e, type, node, ctx) => {
        if (e.__stopPropagation) { // event already been stoped by child node
            return true;
        }

        let handler = getHandler(type, node);
        return handler && handler.apply(ctx, [e]);
    };

    let getHandler = (type, target) => {
        let eventMap = target && target[eventMapHook];
        return eventMap && eventMap[type];
    };

    let dispatchEvent = (type, e) => {
        let handler = handlerMap[type];
        handler && handler(e);
    };

    return {
        listenEventType,
        clearEvents,
        removeListenerType,
        getDocs,
        attachDocument,
        dispatchEvent
    };
};

/**
 * get the path of node
 */
let getNodePath = (target) => {
    let paths = [];
    while (target) {
        paths.push(target);
        target = target.parentNode;
    }
    return paths;
};

let getGlobalEventTypeId = (type) => `${globalEventTypePrefix}${type}`;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(12);

let {
    isArray, isFunction, isObject
} = __webpack_require__(0);

let {
    map
} = __webpack_require__(1);

module.exports = (...args) => {
    let tagName = args[0],
        attrs = {},
        childs = [];
    if (isArray(args[1])) {
        childs = args[1];
    } else if (isFunction(args[1])) {
        childs = [args[1]];
    } else {
        if (isObject(args[1])) {
            attrs = args[1];
            if (isArray(args[2])) {
                childs = args[2];
            } else if (isFunction(args[2])) {
                childs = [args[2]];
            }
        }
    }

    return (...params) => {
        let renderList = (list) => {
            return map(list, (viewer) => {
                if (isArray(viewer)) {
                    return renderList(viewer);
                } else if (isFunction(viewer)) {
                    return viewer(...params);
                } else {
                    return viewer;
                }
            });
        };

        return n(tagName, attrs, renderList(childs));
    };
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    styles
} = __webpack_require__(3);

let basics = {
    pageColor: '#e4e4e4',
    hoverColor: '#e9ece5',
    blockColor: '#3b3a36',
    borderColor: '#b3c2bf',
    veilColor: 'rgba(60,60,60,0.6)',
    fontColor: 'white',
    noticeColor: 'rgb(23, 21, 21)',

    titleSize: 20,
    normalSize: 16,

    narrowPadding: '4 8 4 8',

    contrastBlockColor: 'white',
    contrastFontColor: 'black'
};

let container = {
    position: 'relative',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    border: 0,
    borderRadius: 0,
    overflow: 'auto'
};

let fullParentHeight = {
    height: '100%'
};

let fullParentWidth = {
    width: '100%'
};

let fullWindow = styles(container, {
    position: 'fixed',
    left: 0,
    top: 0,
}, fullParentWidth, fullParentHeight);

let fullParent = styles(container, fullParentWidth, fullParentHeight);

let bulk = styles(container, {
    minWidth: 40,
    backgroundColor: basics.blockColor,
    color: basics.fontColor
});

let contrastBulk = styles(bulk, {
    backgroundColor: basics.contrastBlockColor,
    color: basics.contrastFontColor
});

let oneLineBulk = styles(bulk, {
    padding: basics.narrowPadding,
    fontSize: basics.normalSize,
    textAlign: 'center',
    lineHeight: 20,
    textDecoration: 'none',
    border: 'none',
    color: basics.fontColor
});

let flat = {
    appearance: 'none',
    '-webkit-appearance': 'none',
    '-moz-appearance': 'none',
    boxShadow: 'none',
    borderRadius: 'none',
    border: 0
};

let inputBox = styles(contrastBulk, flat, {
    width: 260,
    padding: basics.narrowPadding,
    backgroundColor: basics.fontColor
});

let textAreaBox = styles(inputBox, {
    width: 360,
    height: 200,
    outline: 'none',
    resize: 'none',
    overflow: 'auto',
    border: `1px solid ${basics.borderColor}`,
    borderRadius: 5,
    fontSize: 16
});

let underLineBorder = {
    border: 0,
    borderRadius: 0,
    'border-bottom': `1px solid ${basics.borderColor}`
};

let underLineFocus = {
    'border-bottom': `2px solid ${basics.blockColor}`
};

let actions = {
    cling: {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box'
    },

    hover: {
        backgroundColor: basics.hoverColor
    },

    active: {
        backgroundColor: basics.hoverColor
    },

    focus: {
        outline: 'none'
    }
};

module.exports = {
    basics,

    bulk,
    oneLineBulk,
    inputBox,
    textAreaBox,
    underLineBorder,
    underLineFocus,
    container,

    fullWindow,
    fullParent,
    fullParentWidth,
    fullParentHeight,

    actions
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isMapObject
} = __webpack_require__(3);

let {
    mount,
    n,
    parseStyle
} = __webpack_require__(6);

const VIEW_CLASS_PREFIX = 'kabanery-lumine';

let count = -1;

module.exports = (classTable) => {
    count++;

    let viewClassId = `${VIEW_CLASS_PREFIX}-${count}`;

    let getStyleRuleName = (name) => {
        if (name[0] === '@') {
            let prev = name.split(' ')[0];
            let next = name.substring(prev.length).trim();
            return `${prev} ${viewClassId}-${next}`;
        } else {
            return `.${viewClassId}-${name}`;
        }
    };

    let appendStyle = () => {
        if (styleCssRules) {
            mount(n('style', {
                id: viewClassId
            }, styleCssRules), document.head);
            styleCssRules = null;
        }
    };

    let getClassName = (name) => {
        if (name[0] === '@') {
            let prev = name.split(' ')[0];
            let next = name.substring(prev.length).trim();
            name = next;
        }

        return `${viewClassId}-${name.split(':')[0]}`;
    };

    let updateClassTable = (newClassTable) => {
        let node = document.getElementById(viewClassId);
        if (node) {
            node.parentNode.removeChild(node);
        }

        setStyleCssRules(newClassTable);
        appendStyle();
    };

    let styleCssRules = null;

    let setStyleCssRules = (classTable) => {
        if (isMapObject(classTable)) {
            styleCssRules = '';
            for (let name in classTable) {
                name = name.trim();
                let styleRuleName = getStyleRuleName(name);
                let classCnt = classTable[name];
                if (typeof classCnt === 'function') {
                    classCnt = classCnt({
                        getClassName
                    });
                }
                let styleRuleContent = parseStyle(classCnt, {
                    valueWrapper: (value) => `${value} !important`
                });
                styleCssRules += `\n${styleRuleName} {${styleRuleContent}}`;
            }
        }
    };

    setStyleCssRules(classTable);

    return {
        appendStyle,
        getClassName,
        updateClassTable
    };
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    get,
    set
} = __webpack_require__(3);

let {
    Signal
} = __webpack_require__(4);

const CHILD_SOURCE_TYPE = 'child';

const identity = v => v;

/**
 * binding view with another view's props through a key map
 *
 * keyMap = {
 *    binderKey: bindedKey
 * }
 */

let syncBindWithKeyMap = (ctx, keyMap, {
    bindedProps = {},
    stopSignal,
    autoUpdate = false,
    updatedSignalTypes = null,
    onChildSignal,
    toBinded = identity,
    toBinder = identity
} = {}) => {
    // TODO check

    let viewData = ctx.getData();
    let props = viewData.props;
    let mappings = [];
    for (let binderKey in keyMap) {
        mappings.push([binderKey, keyMap[binderKey]]);
    }

    let mapedPropsValue = mappings.reduce((prev, [binderKey, bindedKey]) => {
        let propValue = get(props, binderKey); // get from binder
        set(prev, bindedKey, toBinded(propValue, binderKey, bindedKey)); // set for binded
        return prev;
    }, {});

    let onsignal = (signal, data, sourceCtx) => {
        // when event happened, sync the data
        mappings.forEach(([binderKey, bindedKey]) => {
            let propValue = get(data.props, bindedKey); // get from child
            set(props, binderKey, toBinder(propValue, binderKey, bindedKey)); // set for parent
        });

        // handle the signal if necessary
        onChildSignal && onChildSignal(signal, data, sourceCtx);

        if (!stopSignal) {
            // pop up the signal, TODO wrap the sigal to resolve chain
            ctx.notify(
                Signal(signal.type, {
                    sourceType: CHILD_SOURCE_TYPE,
                    keyMap,
                    sourceSignal: signal,
                    sourceData: data,
                    sourceCtx
                })
            );
        }

        if (autoUpdate) {
            if (!updatedSignalTypes) {
                ctx.update(); // update binder view
            } else {
                if (updatedSignalTypes.findIndex((type) => type === signal.type) !== -1) {
                    ctx.update(); // update binder view
                }
            }
        }
    };

    // construct child props
    return Object.assign({
        theme: props.theme // extend theme by default
    }, bindedProps, mapedPropsValue, {
        onsignal
    });
};

module.exports = {
    syncBindWithKeyMap
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    noticeProgress
} = __webpack_require__(67);
let {
    Signal
} = __webpack_require__(4);

const SIGNAL_LOADER_SHOW = 'loader-show';
const SIGNAL_LOADER_HIDE = 'loader-hide';

let loadingProgress = (fn, ctx, loaderShowKey = 'show') => (...args) => {
    ctx.updateWithNotify(Signal(SIGNAL_LOADER_SHOW), loaderShowKey, true);

    let ret = fn(...args);

    ret.then((data) => {
        ctx.updateWithNotify(Signal(SIGNAL_LOADER_HIDE), loaderShowKey, false);

        return data;
    }).catch(err => {
        ctx.updateWithNotify(Signal(SIGNAL_LOADER_HIDE), loaderShowKey, false);

        throw err;
    });

    return ret;
};

let loadingNoticeProgress = (fn, ctx, loaderShowKey, noticeShowKey, noticeTextKey) => {
    return loadingProgress(noticeProgress(fn, ctx, noticeShowKey, noticeTextKey), ctx, loaderShowKey);
};

module.exports = {
    loadingProgress,
    loadingNoticeProgress
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    Signal
} = __webpack_require__(4);

const SIGNAL_NOTICE_SHOW = 'notice-show';

let noticeProgress = (fn, ctx, noticeShowKey = 'show', noticeTextKey = 'text') => {
    return (...args) => {
        return fn(...args).catch((err) => {
            ctx.updateWithNotify(Signal(SIGNAL_NOTICE_SHOW), [
                [noticeShowKey, true],
                [noticeTextKey, err.toString()]
            ]);
            throw err;
        });
    };
};

module.exports = {
    noticeProgress
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let querystring = __webpack_require__(20);

let {
    deepMergeMap
} = __webpack_require__(3);

// TODO opt performance
// TODO avoid save theme
// TODO black list for properties
// TODO expire time

let pagePropsStore = (options = {}) => {
    let {
        version = 1.0
    } = options;

    let key = options.key || getDefaultKey(options);

    let set = (props) => {
        localStorage[key] = JSON.stringify({
            version,
            props: deepMergeMap({}, props, '', {
                blackList: options.blackList
            })
        });
    };

    let get = (originProps = {}) => {
        let dataStr = localStorage[key];
        if (!dataStr) return responseOriginProps(originProps);

        try {
            let data = JSON.parse(dataStr);
            if (data.version < version) {
                return responseOriginProps(originProps);
            } else if (data.version < version) {
                console.error(`unexpected situation happened, storaged data version is bigger than current version. Storaged data version is ${data.version}. Current version is ${version}.`); // eslint-disable-line
                return responseOriginProps(originProps);
            } else {
                // merge dataProps and stored props
                return deepMergeMap(originProps, data.props);
            }
        } catch (err) {
            return responseOriginProps(originProps);
        }
    };

    let responseOriginProps = (originProps) => {
        set(originProps);
        return originProps;
    };

    return {
        get,
        set
    };
};

let getDefaultKey = ({
    pageQueryKey = 'page'
} = {}) => { // key should reflect a page
    let key = `${document.title}-${window.location.pathname}`;

    let obj = querystring.parse(window.location.search.substring(1));

    if (obj && obj[pageQueryKey] !== undefined) {
        key = `${key}?page=${obj[pageQueryKey]}`;
    }

    return key;
};

let wrapPagePropsWithStore = (props, options = {}) => {
    let {
        get,
        set
    } = pagePropsStore(options);

    let originOnsignal = props.onsignal;

    props.onsignal = (signal, data, ctx) => {
        if (options.signalTypes) {
            if (options.signalTypes.findIndex((type) => signal.type === type) !== -1) {
                set(data.props);
            }
        } else {
            set(data.props);
        }
        return originOnsignal && originOnsignal(signal, data, ctx);
    };

    return get(props);
};

module.exports = {
    pagePropsStore,
    wrapPagePropsWithStore
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let lumineView = __webpack_require__(2);

let n = __webpack_require__(7);

let Full = __webpack_require__(23);

let {
    styles
} = __webpack_require__(3);

const {
    MODE_PILE,
    MODE_PERCENTAGE
} = __webpack_require__(24);

/**
 * top + bottom
 */

module.exports = lumineView(({
    props,
    children
}) => {
    let {
        theme,
        style,
        mode,
        pers
    } = props;

    // TODO validate

    if (mode === MODE_PERCENTAGE) {
        let sum = children.reduce((prev, _, index) => {
            let cur = pers[index];
            cur = cur === undefined ? 1 : cur;
            return prev + cur;
        }, 0);

        style.childs = children.map((_, index) => styles(theme.container, theme.fullParentWidth, {
            height: sum === 0 ? 0 : ((pers[index] === undefined ? 1 : pers[index]) / sum) * 100 + '%'
        }, style.childs[index] || {}));
    } else if (mode === MODE_PILE) {
        style.childs = children.map((_, index) => styles(theme.container, theme.fullParentWidth, style.childs[index] || {}));
    }

    return n(Full, {
        style: style.container,
        theme
    }, [
        children.map((child, i) => n('div', {
            style: style.childs[i]
        }, [child]))
    ]);
}, {
    defaultProps: {
        mode: MODE_PILE,
        pers: [],
        style: {
            container: {},
            childs: {}
        }
    }
});


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let lumineView = __webpack_require__(2);

let n = __webpack_require__(7);

let Full = __webpack_require__(23);

let {
    styles
} = __webpack_require__(3);

const {
    MODE_PERCENTAGE,
    MODE_PILE
} = __webpack_require__(24);

/**
 *
 * layout mode
 *
 *  percentage
 *  left pile
 *  right pile
 *
 *  flex
 */

module.exports = lumineView(({
    props,
    children
}) => {
    let {
        theme,
        style,
        mode,
        pers
    } = props;
    // TODO validate
    if (mode === MODE_PILE) {
        style.childs = children.map((_, index) => styles(theme.container, theme.fullParentHeight, {
            'float': 'left'
        }, style.childs[index] || {}));
    } else if (mode === MODE_PERCENTAGE) {
        let sum = children.reduce((prev, _, index) => {
            let cur = pers[index];
            cur = cur === undefined ? 1 : cur;
            return prev + cur;
        }, 0);

        style.childs = children.map((_, index) => styles(theme.container, theme.fullParentHeight, {
            'float': 'left',
            width: sum === 0 ? 0 : ((pers[index] === undefined ? 1 : pers[index]) / sum) * 100 + '%'
        }, style.childs[index] || {}));
    }

    return n(Full, {
        style: style.container,
        theme
    }, [
        children.map((child, index) => n('div', {
            style: style.childs[index]
        }, child)),

        (mode === MODE_PERCENTAGE || mode === MODE_PILE) && n('div style="clear:both"')
    ]);
}, {
    defaultProps: {
        mode: MODE_PILE,
        pers: [],
        style: {
            container: {},
            childs: []
        }
    }
});


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(6);

let lumineView = __webpack_require__(2);

let {
    Signal
} = __webpack_require__(4);

let {
    styles
} = __webpack_require__(3);

module.exports = lumineView(({
    props
}, {
    notify,
    getClassName
}) => {
    let attributes = {
        'class': `${getClassName('input')}`,
        style: props.style,
        type: props.type,
        placeholder: props.placeholder,
        oninput: (e) => {
            props.value = e.target.value;
            notify(Signal('input'));
        },
        value: props.value
    };
    if (props.id) {
        attributes.id = props.id;
    }
    return n('input', attributes);
}, {
    defaultProps: {
        value: '',
        type: 'value',
        placeholder: '',
        style: (theme) => styles(theme.inputBox, theme.underLineBorder)
    },

    classTable: (theme) => {
        return {
            'input:focus': styles(theme.actions.focus, theme.underLineFocus)
        };
    }
});


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(6);

let lumineView = __webpack_require__(2);

let {
    Signal
} = __webpack_require__(4);

let {
    styles
} = __webpack_require__(3);

module.exports = lumineView(({
    props
}, {
    notify,
    getClassName
}) => {
    return n('textarea', {
        'class': `${getClassName('valuearea')}`,
        style: props.style,
        type: props.type,
        placeholder: props.placeholder,
        oninput: (e) => {
            props.value = e.target.value;
            notify(Signal('input'));
        }
    }, [props.value]);
}, {
    defaultProps: {
        value: '',
        type: 'value',
        placeholder: '',
        style: (theme) => styles(theme.textAreaBox)
    },

    classTable: (theme) => {
        return {
            'valuearea:focus': styles(theme.actions.focus)
        };
    }
});


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(6);
let lumineView = __webpack_require__(2);
let {
    Signal
} = __webpack_require__(4);
let {
    styles
} = __webpack_require__(3);

module.exports = lumineView(({
    props,
    children
}, {
    notify,
    getClassName
}) => {
    // TODO validate
    let attributes = {
        'class': `${getClassName('btn')}`,
        style: props.style,
        onclick: () => {
            notify(Signal('click'));
        }
    };
    if (props.id) {
        attributes.id = props.id;
    }
    return n('button', attributes, children[0]);
}, {
    defaultProps: {
        style: (theme) => styles(theme.oneLineBulk)
    },

    classTable: (theme) => {
        return {
            'btn:hover': theme.actions.hover,
            'btn:active': theme.actions.signal,
            'btn:focus': theme.actions.focus
        };
    }
});


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let n = __webpack_require__(7);
let lumineView = __webpack_require__(2);

let TextLoading = __webpack_require__(75);
let PageMask = __webpack_require__(76);
let Empty = __webpack_require__(78);

module.exports = lumineView(({
    props,
    children
}) => {
    return props.show ? n(PageMask, {
        style: props.style
    }, children) : Empty();
}, {
    defaultProps: {
        show: true,
        style: {
            textAlign: 'center'
        }
    },
    defaultChildren: [n(TextLoading, {
        style: {
            position: 'relative',
            top: '50%',
            marginTop: -10
        }
    })]
});


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let n = __webpack_require__(7);

let lumineView = __webpack_require__(2);

// TODO easy disappear for loading view
module.exports = lumineView(({
    props
}, {
    getClassName
}) => {
    return props.show ? n('div', {
        'class': getClassName('load-suffix'),
        style: props.style
    }, props.textPrefix) : n('div');
}, {
    defaultProps: {
        textPrefix: 'loading',
        show: true,
        style: {
            display: 'inline-block'
        }
    },

    classTable: {
        '@keyframes loading': `
    0% {
        content: ""
    }
    33% {
        content: "."
    }
    67% {
        content: ".."
    }
    100% {
        content: "..."
    }`,
        'load-suffix::after': ({
            getClassName
        }) => {
            return {
                content: JSON.stringify('.'),
                animation: `${getClassName('loading')} 3s infinite ease-in-out`
            };
        }
    }
});


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let FullWindow = __webpack_require__(77);
let lumineView = __webpack_require__(2);
let n = __webpack_require__(7);

module.exports = lumineView(({
    props,
    children
}) => {
    return n(FullWindow, props, children);
}, {
    defaultProps: {
        style: (theme) => {
            return {
                backgroundColor: theme.basics.veilColor,
                color: theme.basics.fontColor,
                zIndex: 1000
            };
        }
    }
});


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    n
} = __webpack_require__(6);
let lumineView = __webpack_require__(2);
let {
    styles
} = __webpack_require__(3);

module.exports = lumineView(({
    props,
    children
}) => {
    return n('div', {
        style: props.style
    }, children);
}, {
    defaultProps: {
        style: (theme) => styles(theme.fullWindow)
    },

    defaultChildren: []
});


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let n = __webpack_require__(7);
let lumineView = __webpack_require__(2);

module.exports = lumineView(() => {
    return n('div', {
        style: {
            width: 0,
            height: 0
        }
    });
});


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let n = __webpack_require__(7);
let lumineView = __webpack_require__(2);
let {
    Signal
} = __webpack_require__(4);

let {
    styles
} = __webpack_require__(3);

module.exports = lumineView(({
    props
}, {
    updateWithNotify
}) => {
    if (props.show && props.duration !== 'forever') {
        setTimeout(() => {
            updateWithNotify(Signal('notice-hide'), 'props.show', false);
        }, props.duration);
    }
    return n('div', {
        style: {
            zIndex: 10000,
            position: 'fixed',
            width: '100%',
            height: 0,
            left: 0,
            top: '50%',
            textAlign: 'center'
        }
    }, [
        props.show && n('div', {
            style: props.style
        }, props.text)
    ]);
}, {
    defaultProps: {
        text: '',
        show: true,
        duration: 3000,
        style: (theme) => styles(theme.oneLineBulk, {
            display: 'inline-block',
            backgroundColor: theme.basics.noticeColor,
            maxWidth: 400,
            maxHeight: 200,
            top: -100,
            position: 'relative',
        })
    }
});


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let apiStub = __webpack_require__(81);
let pfcApis = __webpack_require__(82);

module.exports = pfcApis('/api/pfc', apiStub);


/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = {
    loadViewFile: {
        type: 'function',
        validateParamItem: (paramValue, index) => {
            if (index === 0) {
                if (!paramValue) {
                    throw new Error('view file can not be empty!');
                }
            }
        }
    }
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let stubAsApis = __webpack_require__(83);
let pfcRequestor = __webpack_require__(25);

module.exports = (apiPath, stub) => {
    let pfcRequest = pfcRequestor(apiPath);
    let apis = stubAsApis(stub);

    let apiMap = {};

    for (let name in apis) {
        let api = apis[name];
        if (typeof api === 'function') {
            apiMap[name] = (...params) => {
                let lazy = () => {
                    // resolve params first
                    let paramValues = [];
                    for (let i = 0; i < params.length; i++) {
                        let param = params[i];
                        if (isLazyFun(param)) {
                            paramValues.push(param());
                        } else {
                            paramValues.push(param);
                        }
                    }

                    return api(...paramValues);
                };

                lazy.tag = 'lazy';

                return lazy;
            };
        } else {
            apiMap[name] = api;
        }
    }

    let runApi = (exp) => {
        try {
            if (isLazyFun(exp)) {
                exp = exp();
            }
            return pfcRequest(exp.code);
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        apiMap,
        runApi
    };
};

let isLazyFun = (f) => {
    return typeof f === 'function' && f.tag === 'lazy';
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let {
    isObject,
    isFunction
} = __webpack_require__(84);

/**
 * we got stub and use it as apis to ccontruct pfc code
 */

module.exports = (variableStub = {}) => {
    let apiMap = {};

    for (let name in variableStub) {
        let stub = variableStub[name];
        if (stub.type === 'function') {
            apiMap[name] = (...params) => callStubFunction(name, params, variableStub[name] || {});
        } else {
            apiMap[name] = callStubVariable(name);
        }
    }

    return apiMap;
};

let callStubVariable = (variable) => {
    return {
        code: `${variable}`,
        type: 'variable'
    };
};

let callStubFunction = (variable, params, stub) => {
    let code = `${variable}(`;

    let fullAtoms = true,
        paramValues = [];

    for (let i = 0; i < params.length; i++) {
        let param = params[i];
        if (isObject(param) && param.type === 'function') {
            code += param.code;
            fullAtoms = false;
        } else if (isObject(param) && param.type === 'variable') {
            code += param.code;
            fullAtoms = false;
        } else {
            paramValues.push(param);
            // validate atom param
            if (isFunction(stub.validateParamItem)) {
                stub.validateParamItem(param, i);
            }
            code += serializeAtom(param);
        }

        if (i < params.length - 1) {
            code += ',';
        }
    }

    if (fullAtoms && isFunction(stub.validateParams)) {
        stub.validateParams(paramValues);
    }

    code += ')';

    return {
        type: 'function',
        code
    };
};

let serializeAtom = (atom) => {
    if (typeof atom === 'string') {
        return `"${atom}"`;
    } else if (atom === null) {
        return 'null';
    } else if (atom === true) {
        return 'true';
    } else if (atom === false) {
        return 'false';
    } else if (typeof atom === 'number') {
        return atom + '';
    } else {
        throw new Error(`unexpected atom type in pfc, atom is ${atom}.`);
    }
};


/***/ }),
/* 84 */
/***/ (function(module, exports) {

// ignore whitespace
let processTokens = (rawTokens) => {
    let tokens = [];
    for (let i = 0; i < rawTokens.length; i++) {
        let {
            text, tokenType
        } = rawTokens[i];

        let name = tokenType.name;

        if (name !== 'whitespace') { // ignore white space
            tokens.push({
                text,
                name
            });
        }
    }

    return tokens;
};

let getProductionId = (production) => {
    return `${production[0]} := ${production[1].join(' ')}`;
};

let isFunction = (v) => typeof v === 'function';

let isObject = (v) => v && typeof v === 'object';

module.exports = {
    processTokens,
    getProductionId,
    isFunction,
    isObject
};


/***/ })
/******/ ]);