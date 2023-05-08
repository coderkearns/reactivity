export interface Subscription<T> {
    $subscribe(subscriber: (value: T) => void): void
}

/**
 * Returns true if the given value is a reactive object (ReactiveValue, ReactiveArray, or ReactiveObject).
 */
export function isReactive(item: unknown): item is Reactive {
    return typeof item === 'object' && typeof (<Subscription<unknown>>item).$subscribe === 'function' && typeof (<Reactive>item).get === 'function'
}


/**
 * One of the three types of reactive objects: ReactiveValue, ReactiveArray, or ReactiveObject.
 */
export type Reactive = ReactiveValue<unknown> | ReactiveArray<unknown> | ReactiveObject<object>

/**
 * Converts a simple item (object, array, or other value) to its reactive representation.
 * If the item is already reactive, it is returned unchanged.
 */
export function createReactive(item: unknown): Reactive {
    if (isReactive(item)) {
        return item
    }

    if (typeof item === "object") {
        if (Array.isArray(item)) {
            return reactiveArray(item)
        } else if (item !== null) {
            return reactiveObject(item)
        }
    }

    return reactiveValue(item)
}

export interface BaseSubscription<T> extends Subscription<T> {
    $publish(value: T): void
}

/**
 * A simple subscription object, with no automatic binding done.
 */
export function subscription<T>(): BaseSubscription<T> {
    const subscribers: Array<(value: T) => void> = []
    return {
        $subscribe(subscriber) {
            subscribers.push(subscriber)
        },
        $publish(value) {
            subscribers.forEach(subscriber => subscriber(value))
        }
    }
}

export interface ReactiveValue<T> extends Subscription<T> {
    get(): T
    set(value: T): void
}

/**
 * A subscriptable value - like a variable with a subscription attached.
 * @example
 * const value = reactiveValue(10)
 * value.$subscribe(console.log)
 * value.get() // => 10
 * value.set(20) // logs 20
 * value.get() // => 20
 */
export function reactiveValue<T>(initialValue: T) {
    const _subscription = subscription<T>()
    let _value = initialValue
    return {
        $subscribe: _subscription.$subscribe,
        get(): T {
            return _value
        },
        set(newValue: T) {
            _value = newValue
            _subscription.$publish(newValue)
        }
    }
}

export interface ReactiveArray<T> extends Subscription<[number, T | undefined]> {
    get(index: number): T
    set(index: number, value: T): void
    push(value: T): void
    pop(): T | undefined,
    static(): Array<T>
}

/**
 * A subscriptable array.
 * Acts as a proxy to a real array, but also holds a subscription.
 * @example
 * const array = reactiveArray(["a"])
 * array.$subscribe(console.log)
 * array.get(0) // => "a"
 * array.push("b") // logs [1, "b"]
 * array.pop() // logs [-1, "b"]
 * array.pop() // logs [-1, "a"]
 * array.pop() // logs [-1, undefined]
 */
export function reactiveArray<T>(initialValue: T[]): ReactiveArray<T> {
    const _subscription = subscription<[number, T | undefined]>()
    let _value = [...initialValue]
    return {
        $subscribe: _subscription.$subscribe,
        get(index: number): T {
            return _value[index]
        },
        set(index: number, value: T): void {
            _value[index] = value
            _subscription.$publish([index, value])
        },
        push(value: T): void {
            _value.push(value)
            _subscription.$publish([_value.length - 1, value])
        },
        pop(): T | undefined {
            let ret = _value.pop()
            _subscription.$publish([-1, ret])
            return ret
        },
        static(): Array<T> {
            return _value
        }
    }
}

export interface ReactiveObject<T> extends Subscription<[keyof T, T[keyof T]]> {
    get<K extends keyof T>(key: K): T[K]
    set<K extends keyof T>(key: K, value: T[K]): void
    mutate<K extends keyof T>(key: K, updater: (value: T[K]) => T[K]): void,
    static(): T
}

/**
 * A subscriptable object.
 * Acts as a proxy to a real object, but also holds a subscription.
 * @example
 * const object = reactiveObject({a: 1, b: 2, c: [1, 2, 3]})
 * object.$subscribe(console.log)
 * object.get("a") // => 1
 * object.set("b", 3) // logs ["b", 3]
 * object.mutate("c", (arr) => arr.push(4)) // logs ["c", [1, 2, 3, 4]]
 */
export function reactiveObject<T>(initialValue: T): ReactiveObject<T> {
    const _subscription = subscription<[keyof T, T[keyof T]]>()
    let _value = initialValue
    return {
        $subscribe: _subscription.$subscribe,
        get<K extends keyof T>(key: K): T[K] {
            return _value[key]
        },
        set<K extends keyof T>(key: K, value: T[K]): void {
            _value[key] = value
            _subscription.$publish([key, value])
        },
        mutate<K extends keyof T>(key: K, updater: (value: T[K]) => T[K]): void {
            updater(_value[key])
            _subscription.$publish([key, _value[key]])
        },
        static(): T {
            return _value
        }
    }
}

// TODO: new type "Store", which is like a ReactiveObject but instead all of its properties are reactive, and their properties are also reactive, etc.
