import { subscription, reactive } from "./core"

export function event(base, eventName) {
    const _subscription = subscription()
    base.addEventListener(eventName, () => _subscription.$publish())
    return _subscription
}

export function inputChange(el) {
    const _reactive = reactive(el.value)
    el.addEventListener("change", () => _reactive.$set(el.value))
    return _reactive
}
