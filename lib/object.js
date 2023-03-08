import Subscription from "./subscription";
import { makeSubscription } from "./shared";

export default class ReactiveObject extends Subscription {
    constructor(initialObject = {}) {
        super()

        this._internal = {}

        for (const key in initialObject) {
            this.set(key, initialObject[key])
        }
    }

    _makeSubscriberFunc(key) {
        return (value, oldKey = null) => {
            this.publish(value, oldKey ? `${key}.${oldKey}` : key)
        }
    }

    _makeAndSubscribe(value, key) {
        const item = makeSubscription(value)
        item.subscribe(this._makeSubscriberFunc(key))
        return item
    }

    static() {
        const _static = {}
        for (const key in this._internal) {
            _static[key] = this._internal[key].static()
        }
    }

    /* Object methods */
    set(key, value) {
        if (this._internal[key] !== undefined) {
            this._internal[key].set(value)
        } else {
            const item = this._makeAndSubscribe(value, key)
            this._internal[key] = item
            this.publish(value, key)
        }
    }

    get(key) {
        return this._internal[key]
    }
}
