import Subscription from "./subscription";
import { makeSubscription } from "./shared";

export default class ReactiveValue extends Subscription {
    constructor(initialValue) {
        super()
        this._value = initialValue
    }

    get() {
        return this._value
    }

    set(value) {
        this._value = value
        this.publish(this._value)
    }

    static() {
        return this._value
    }
}
