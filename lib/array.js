import Subscription from "./subscription";
import { makeSubscription } from "./shared";

export default class ReactiveArray extends Subscription {
    constructor(initialArray) {
        super()

        this._internal = []

        for (const item of initialArray) {
            this._internal.push(makeSubscription(item))
        }
    }

    static() {
        return this._internal.map(item => item.static())
    }

    // TODO: implement all the stuff
}
