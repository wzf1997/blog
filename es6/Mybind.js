// 手写bind  

// 第一版本
Function.prototype.myBind = function(context,...args) {
    let self = this;
    return function() {
        let totalargs =  [ ...Array.from(arguments),...args ]
        self.apply(context,totalargs);
    }
}

// 返回的函数作为构造函数的 
Function.prototype.myBind = function(context,...args) {
    let self = this;
    const fBound = function() {
        let totalargs =  [ ...Array.from(arguments),...args ]
        // 这里做一个 this 判断是new 的情况下
        let ctx = context;
        if(this instanceof fBound) {
            // 说明这是new的情况 
            ctx = this
        }
        return self.apply(ctx,totalargs);
    }
    fBound.prototype = this.prototype;
    return  fBound
}

