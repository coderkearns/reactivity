import Subscription from "./subscription";

export default class ReactiveObject extends Subscription {
    constructor(initialObject) {
        super()

        this._internal = {}

        for (const key in initialObject) {
            this._internal[key] = Subscription.from(initialObject[key])
        }
    }

    static() {
        const _static = {}
        for (const key in this._internal) {
            _static[key] = this._internal[key].static()
        }
    }

    // TODO: implement all the stuff
}
