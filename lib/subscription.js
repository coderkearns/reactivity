import ReactiveValue from "./value"
import ReactiveArray from "./array"
import ReactiveObject from "./object"

export default class Subscription {
    constructor() {
        this._subscribers = []
    }

    subscribe(subscriber) {
        this._subscribers.push(subscriber)
    }

    publish(...values) {
        for (let subscriber of this._subscribers) {
            subscriber(...values)
        }
    }

    static from(item) {
        if (typeof item === "object") {
            if (Array.isArray(item)) {
                return new ReactiveArray(item)
            } else {
                return new ReactiveObject(item)
            }
        }

        return new ReactiveValue(item)
    }
}
