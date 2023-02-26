import Subscription from "./subscription";

export default class Value extends Subscription {
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
