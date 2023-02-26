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

    // I want to do something like this, but it would cause circular dependencies:
    static from(item) {
        if (typeof item === "object") {
            if (Array.isArray(item)) {
                // return new ReactiveArray(item)
            } else {
                // return new ReactiveObject(item)
            }
        }

        // return new ReactiveValue(item)
    }
}
