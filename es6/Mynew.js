// new 原理实现
function _new(ctor, ...args) {
    // 如果当前 不是一个函数 抛出错误;
    if(typeof ctor !== 'function') {
        throw 'ctor must be a function';
    }
    let obj = new Object();
    // 原式继承
    obj.__proto__ = Object.create(ctor.prototype);
    let res = ctor.apply(obj,  [...args]);
    // 判断当前构造函数返回值 是 对象 或者是一个函数  就返回这个 否则就返回一个新对象
    let isObject = typeof res === 'object' && typeof res !== null;
    let isFunction = typeof res === 'function';
    return isObject || isFunction ? res : obj;
};