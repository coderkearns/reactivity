import Subscription from "./subscription";

export default class ReactiveArray extends Subscription {
    constructor(initialArray) {
        super()

        this._internal = []

        for (const item of initialArray) {
            // I want to convert the items into their wrapper counterparts, something like:
            // this._internal.push(Subscription.from(item))
        }
    }

    static() {
        return this._internal.map(item => item.static())
    }

    // TODO: implement all the stuff
}
