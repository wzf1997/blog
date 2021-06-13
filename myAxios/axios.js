class InterceptorManager {
  constructor() {
    // 存放所有拦截器的栈
    this.handlers = []
  }

  use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled,
      rejected,
    })
    //返回id 便于取消
    return this.handlers.length - 1
  }
  // 取消一个拦截器
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null
    }
  }

  // 执行栈中所有的hanlder
  forEach(fn) {
    this.handlers.forEach((item) => {
      if (item) {
        fn(item)
      }
      return
    })
  }
}

//发送ajax请求
function dispatchRequest(config) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open(config.method, config.url)
    xhr.onreadystatechange = function () {
      if (xhr.status == 200) {
        resolve(1)
      } else {
        reject('失败了')
      }
    }
    xhr.send()

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!xhr) {
          return
        }
        xhr.abort()
        reject(cancel)
        // Clean up request
        xhr = null
      })
    }
  }).then(
    (res) => {
      return res
    },
    (err) => {
      return Promise.reject(err)
    }
  )
}

export class cancelToken {
  constructor(exactor) {
    if (typeof exactor !== 'function') {
      throw new TypeError('executor must be a function.')
    }
    // 这里其实将promise的控制权 交给 cancel 函数
    // 同时做了防止多次重复cancel 之前 Redux 还有React 源码中也有类似的案列
    let resolvePromise = () => {}
    this.promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    this.reason = undefined

    const cancel = (message) => {
      if (this.reason) {
        return
      }
      this.reason = 'cancel' + message
      resolvePromise(this.reason)
    }
    exactor(cancel)
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  // source 其实本质上是一个语法糖 里面做了封装
  static source() {
    let cancel = () => {}
    const token = new cancelToken(function executor(c) {
      cancel = c
    })
    return {
      token: token,
      cancel: cancel,
    }
  }
}

export default class Axios {
  constructor(config) {
    this.defaults = config
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    }
  }
  // 发送一个请求
  request(config) {
    // 这里呢其实就是去处理了 axios(url[,config])
    if (typeof config == 'string') {
      config = arguments[1] || {}
      config.url = arguments[0]
    } else {
      config = config || {}
    }

    // 默认get请求，并且都转成小写
    if (config.method) {
      config.method = config.method.toLowerCase()
    } else {
      config.method = 'get'
    }

    // dispatchRequest 就是发送ajax请求
    const chain = [dispatchRequest, undefined]
    //  发生请求之前加入拦截的 fulfille 和reject 函数
    this.interceptors.request.forEach((item) => {
      chain.unshift(item.fulfilled, item.rejected)
    })
    // 在请求之后增加 fulfilled 和reject 函数
    this.interceptors.response.forEach((item) => {
      chain.push(item.fulfilled, item.rejected)
    })

    // 利用promise的链式调用，将参数一层一层传下去
    let promise = Promise.resolve(config)

    //然后我去遍历 chain
    while (chain.length) {
      // 这里不断出栈 直到结束为之
      promise = promise.then(chain.shift(), chain.shift())
    }
    return promise
  }
}
