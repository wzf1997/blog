(function () {
    let global = this;
    const makeIterator = function (array, iterator) {
        let nextIndex = 0;
        const obj = {
            next: function () {
                return nextIndex < array.length ?
                    { value: iterator(array[nextIndex++]), done: false } :
                    { value: undefined, done: true };
            }
        };
        // [...set.keys()] 会调用这里
        obj[Symbol.iterator] = function () {
            return obj
        }
        return obj
    }
    class mySet {
        constructor(data) {
            this.data = [];
            if (typeof data[Symbol.iterator] !== "function") {
                throw new TypeError('is not iterable (cannot read property Symbol(Symbol.iterator)')
            }
            data && Array.from(data).forEach(item => {
                this.add(item);
            });
        }

        get size () {
            return this.data.length;
        }

        [Symbol.iterator] () {
            return this.values();
        }

        add (value) {
            if (!this.data.includes(value)) {
                this.data.push(value);
            }
            return this;
        }

        delete (value) {
            if (this.data.includes(value)) {
                const index = this.data.findIndex(item => item === value);
                this.data.splice(index, 1);
                return true
            }
            return false;
        }

        has (value) {
            return this.data.includes(value);
        }

        clear () {
            this.data.length = 0;
        }

        forEach (callback, thisArg) {
            let context = thisArg || global;
            this.data.forEach(item => {
                callback.call(context, item, item, this)
            });
        }


        keys () {
            return makeIterator(this.data, value => value);
        }
        values () {
            return this.keys();
        }

        entires () {
            return makeIterator(this.data, value => [value, value]);
        }
    }
    
    global.mySet = mySet;
})()
 
