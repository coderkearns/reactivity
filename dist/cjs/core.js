"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveObject = exports.ReactiveArray = exports.ReactiveValue = exports.Subscription = exports.createReactive = exports.isReactive = void 0;
/**
 * Returns true if the given value is a reactive object (ReactiveValue, ReactiveArray, or ReactiveObject).
 */
function isReactive(item) {
    return typeof item === 'object' && typeof item.$subscribe === 'function' && typeof item.get === 'function';
}
exports.isReactive = isReactive;
/**
 * Converts a simple item (object, array, or other value) to its reactive representation.
 * If the item is already reactive, it is returned unchanged.
 */
function createReactive(item) {
    if (isReactive(item)) {
        return item;
    }
    if (typeof item === "object") {
        if (Array.isArray(item)) {
            return ReactiveArray(item);
        }
        else if (item !== null) {
            return ReactiveObject(item);
        }
    }
    return ReactiveValue(item);
}
exports.createReactive = createReactive;
/**
 * A simple subscription object, with no automatic binding done.
 */
function Subscription() {
    var subscribers = [];
    return {
        $subscribe: function (subscriber) {
            subscribers.push(subscriber);
        },
        $publish: function (value) {
            subscribers.forEach(function (subscriber) { return subscriber(value); });
        }
    };
}
exports.Subscription = Subscription;
/**
 * A subscriptable value - like a variable with a subscription attached.
 * @example
 * const value = new ReactiveValue(10)
 * value.$subscribe(console.log)
 * value.get() // => 10
 * value.set(20) // logs 20
 * value.get() // => 20
 */
function ReactiveValue(initialValue) {
    var _subscription = Subscription();
    var _value = initialValue;
    return {
        $subscribe: _subscription.$subscribe,
        get: function () {
            return _value;
        },
        set: function (newValue) {
            _value = newValue;
            _subscription.$publish(newValue);
        }
    };
}
exports.ReactiveValue = ReactiveValue;
/**
 * A subscriptable array.
 * Acts as a proxy to a real array, but also holds a subscription.
 * @example
 * const array = new ReactiveArray(["a"])
 * array.$subscribe(console.log)
 * array.get(0) // => "a"
 * array.push("b") // logs [1, "b"]
 * array.pop() // logs [-1, "b"]
 * array.pop() // logs [-1, "a"]
 * array.pop() // logs [-1, undefined]
 */
function ReactiveArray(initialValue) {
    var _subscription = Subscription();
    var _value = __spreadArray([], initialValue, true);
    return {
        $subscribe: _subscription.$subscribe,
        get: function (index) {
            return _value[index];
        },
        set: function (index, value) {
            _value[index] = value;
            _subscription.$publish([index, value]);
        },
        push: function (value) {
            _value.push(value);
            _subscription.$publish([_value.length - 1, value]);
        },
        pop: function () {
            var ret = _value.pop();
            _subscription.$publish([-1, ret]);
            return ret;
        }
    };
}
exports.ReactiveArray = ReactiveArray;
/**
 * A subscriptable object.
 * Acts as a proxy to a real object, but also holds a subscription.
 * @example
 * const object = new ReactiveObject({a: 1, b: 2, c: [1, 2, 3]})
 * object.$subscribe(console.log)
 * object.get("a") // => 1
 * object.set("b", 3) // logs ["b", 3]
 * object.mutate("c", (arr) => arr.push(4)) // logs ["c", [1, 2, 3, 4]]
 */
function ReactiveObject(initialValue) {
    var _subscription = Subscription();
    var _value = initialValue;
    return {
        $subscribe: _subscription.$subscribe,
        get: function (key) {
            return _value[key];
        },
        set: function (key, value) {
            _value[key] = value;
            _subscription.$publish([key, value]);
        },
        mutate: function (key, updater) {
            updater(_value[key]);
            _subscription.$publish([key, _value[key]]);
        }
    };
}
exports.ReactiveObject = ReactiveObject;
// TODO: new type "Store", which is like a ReactiveObject but instead all of its properties are reactive, and their properties are also reactive, etc.
