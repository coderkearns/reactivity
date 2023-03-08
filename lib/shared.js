import ReactiveValue from "./value"
import ReactiveArray from "./array"
import ReactiveObject from "./object"

export function makeSubscription(item) {
    if (typeof item === "object") {
        if (Array.isArray(item)) {
            return new ReactiveArray(item)
        } else {
            return new ReactiveObject(item)
        }
    }

    return new ReactiveValue(item)
}
