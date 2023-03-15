import { subscription, reactive, store } from "./core"

export function event(base, eventName) {
    const _subscription = subscription()
    base.addEventListener(eventName, () => _subscription.$publish())
    return _subscription
}

export function input(el, { transform = v => v } = {}) {
    const _reactive = reactive(transform(el.value))

    el.addEventListener("input", () => _reactive.$set(transform(el.value)))

    _reactive.$subscribe(value => {
        if (el.value !== value) {
            el.value = value
        }
    })

    return _reactive
}

export function form(el) {
    const inputs = [...el.querySelectorAll("[name]")]
    const _store = store(Object.fromEntries(inputs.map(input => [input.name, input.value])))

    inputs.forEach(inp => {
        inp.addEventListener("input", () => _store[inp.name].$set(inp.value))
    })

    _store.$subscribe((value, key) => {
        const inpEl = inputs.find(inp => inp.name === key)
        if (value !== inpEl.value) inpEl.value = value
    })

    return _store
}
