/**
 * @overview 核心库
 *
 * =============================================================================
 *  Defer 延迟处理
 * =============================================================================
 *
 *  API:
 *    1. $.deferred
 *    2. $.promise
 *
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-05-23
 * @todo Rebuild to es6 API
 *
 */

/**
 * 生成 Promise 对象
 * @param {Array} keys 函数名列表
 * @type {Object}
 */
$.deferred = keys => {
  keys = keys || $.deferred.keys || ["done", "fail", "always"];
  var calls = {};
  var promise = {};
  var resolve = {};
  keys.forEach(key => {
    calls[key] = [];
    promise[key] = call => {
      call && calls[key].push(call);
      return promise;
    };
    resolve[key] = () => {
      var args = arguments;
      calls[key].forEach(call => {
        call && call.apply(undefined, args);
      });
      calls[key].splice(0, 0);
      return resolve;
    };
  });
  return {
    calls:   calls,
    promise: promise,
    resolve: resolve,
  }
}



$.promise = {
  all (promises) {
    var deferred = $.deferred();
    var resolve = deferred.resolve;
    var successNum = 0;
    var doneNum = 0;
    var length = promises.length;
    for (let promise of promises) {
      promise.success((...args) => {
        if (++successNum === length) {
          resolve.success(...args).always();
        }
      }).unsuccess((...args) => {
        resolve.unsuccess(...args).always();
      }).done((...args) => {
        if (++doneNum === length) {
          resolve.done(...args).always();
        }
      }).fail((...args) => {
        resolve.fail(...args).always();
      });
    }
    return deferred.promise;
  }
}
