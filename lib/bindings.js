import { reactive } from "./base"

export function inputChange(el) {
    const _reactive = reactive(el.value)
    el.addEventListener("change", () => _reactive.$set(el.value))
    return _reactive
}
