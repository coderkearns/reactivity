var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/index.js
var lib_exports = {};
__export(lib_exports, {
  ReactiveArray: () => ReactiveArray,
  ReactiveObject: () => ReactiveObject,
  ReactiveValue: () => ReactiveValue,
  Subscription: () => Subscription
});
module.exports = __toCommonJS(lib_exports);

// lib/value.js
var ReactiveValue = class extends Subscription {
  constructor(initialValue) {
    super();
    this._value = initialValue;
  }
  get() {
    return this._value;
  }
  set(value) {
    this._value = value;
    this.publish(this._value);
  }
  static() {
    return this._value;
  }
};

// lib/array.js
var ReactiveArray = class extends Subscription {
  constructor(initialArray) {
    super();
    this._internal = [];
    for (const item of initialArray) {
      this._internal.push(Subscription.from(item));
    }
  }
  static() {
    return this._internal.map((item) => item.static());
  }
  // TODO: implement all the stuff
};

// lib/object.js
var ReactiveObject = class extends Subscription {
  constructor(initialObject) {
    super();
    this._internal = {};
    for (const key in initialObject) {
      this._internal[key] = Subscription.from(initialObject[key]);
    }
  }
  static() {
    const _static = {};
    for (const key in this._internal) {
      _static[key] = this._internal[key].static();
    }
  }
  // TODO: implement all the stuff
};

// lib/subscription.js
var Subscription = class {
  constructor() {
    this._subscribers = [];
  }
  subscribe(subscriber) {
    this._subscribers.push(subscriber);
  }
  publish(...values) {
    for (let subscriber of this._subscribers) {
      subscriber(...values);
    }
  }
  static from(item) {
    if (typeof item === "object") {
      if (Array.isArray(item)) {
        return new ReactiveArray(item);
      } else {
        return new ReactiveObject(item);
      }
    }
    return new ReactiveValue(item);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ReactiveArray,
  ReactiveObject,
  ReactiveValue,
  Subscription
});
