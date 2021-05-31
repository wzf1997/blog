
(function () {
    let global = this;

    const makeIterator = function (array, iterator) {
        let nextIndex = 0;
        const obj = {
            next: function () {
                return nextIndex < array.length ? { value: iterator(array[nextIndex++]), done: false } : { value: undefined, done: true };
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

        get size() {
            return this.data.length;
        }

        [Symbol.iterator]() {
            return this.values();
        }

        add(value) {
            if (!this.data.includes(value)) {
                this.data.push(value);
            }
            return this;
        }

        delete(value) {
            if (this.data.includes(value)) {
                const index = this.data.findIndex(item => item === value);
                this.data.splice(index, 1);
                return true
            }
            return false;
        }

        has(value) {
            return this.data.includes(value);
        }

        clear() {
            this.data.length = 0;
        }

        forEach(callback, thisArg) {
            let context = thisArg || global;
            this.data.forEach(item => {
                callback.call(context, item, item, this)
            });
        }


        keys() {
            return makeIterator(this.data, value => value);
        }
        values() {
            return this.keys();
        }

        entires() {
            return makeIterator(this.data, value => [value, value]);
        }
    }
    global.mySet = mySet;
})()

// test 
// let set = new mySet([1, 2, 3, 4, 4]);
// console.log(set.size); // 4

// set.delete(1);
// console.log(set.has(1)); // false

// set.clear();
// console.log(set.size); // 0

// set = new mySet([1, 2, 3, 4, 4]);
// set.forEach((value, key, set) => {
// 	console.log(value, key, set.size)
// });

let set = new mySet([1, 2, 3]);

let set2 = new Set([1, 2, 3]);

// console.log([...set2.keys()], [...set2.values()],[...set2.entries()], '9999')

// console.log([...set.keys()], [...set.values()],[...set.entires()], '88888' )

let set3 = new mySet([2,3]);
let set4 = new mySet(set3);
console.log(set3, set4);
let set5 = new mySet(5);
console.log(set5);


// 迭代器
function createIterator(items) {
    let i = 0;
    return {
        next: function() {
            let done = i >= items.length;
            let value = !done ? items[i++] : undefined;
            return {
                done,
                value
            };
        }
    };
}
// test 一下
const a = createIterator([1,2,3]);

