import Subscription from "./subscription";

export default class ReactiveArray extends Subscription {
    constructor(initialArray) {
        super()

        this._internal = []

        for (const item of initialArray) {
            this._internal.push(Subscription.from(item))
        }
    }

    static() {
        return this._internal.map(item => item.static())
    }

    // TODO: implement all the stuff
}
