import Subscription from "./subscription";
import { makeSubscription } from "./shared";

export default class ReactiveArray extends Subscription {
    constructor(initialArray = []) {
        super()

        this._internal = []

        for (const value of initialArray) {
            this.push(value)
        }
    }

    _makeSubscriberFunc(key) {
        return (value, oldKey = null) => {
            this.publish(value, oldKey ? `${key}.${oldKey}` : `${key}`)
        }
    }

    _makeAndSubscribe(value, key) {
        const item = makeSubscription(value)
        item.subscribe(this._makeSubscriberFunc(key))
        return item
    }

    static() {
        return this._internal.map(item => item.static())
    }

    /* Array methods */
    push(value) {
        const key = this._internal.length
        const item = this._makeAndSubscribe(value, key)
        this._internal.push(item)
        this.publish(value, `${key}`)
    }
}

export function factory(initialArray) {
    return new ReactiveArray(initialArray)
}
