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
}
