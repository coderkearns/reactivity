import { subscription, reactive } from "./core"

export function event(base, eventName) {
    const _subscription = subscription()
    base.addEventListener(eventName, () => _subscription.$publish())
    return _subscription
}

export function input(el, { transform = v => v }) {
    const _reactive = reactive(transform(el.value))
    el.addEventListener("input", () => _reactive.$set(transform(el.value)))
    return _reactive
}
