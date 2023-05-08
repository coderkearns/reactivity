import { subscription, reactiveValue, reactiveObject } from "./core"

interface EventEmitter {
    addEventListener(event: string, listener: (...args: any[]) => void): void
}

export function event<Event>(base: EventEmitter, event: string): Subscription<Event> {
    const _subscription = subscription<Event>()
    base.addEventListener(event, (e) => _subscription.$publish(e))
    return _subscription
}

type InputOptions<T> = {
    transform?: (value: any) => T
}

export function input<T>(inputEl: EventEmitter & { value: any }, { transform = (value) => value }: InputOptions<T> = {}): ReactiveValue<T> {
    const _reactiveValue = reactiveValue(transform(inputEl.value))
    inputEl.addEventListener("input", (e) => _reactiveValue.set(transform(e.target.value)))
    return _reactiveValue
}

export function form<T extends { [key: string]: any }>(formEl: EventEmitter & { querySelectorAll: (selector: string) => NodeListOf<Element> }): ReactiveObject<T> {
    const inputs: Array<Element & { name: string, value: any }> = Array.from(formEl.querySelectorAll("[name]")) as any
    const _reactiveObject = reactiveObject<T>(Object.fromEntries(inputs.map(input => [input.name, input.value])) as T)

    inputs.forEach(input => input.addEventListener("input", (e) => _reactiveObject.set(input.name, (<Element & { value: any }>e.target).value)))

    _reactiveObject.$subscribe(([key, value]) => {
        const inpEl = inputs.find(inp => inp.name === key)
        if (!inpEl) return
        if (value !== inpEl.value) inpEl.value = value
    })

    return _reactiveObject
}
