export interface Subscription<T> {
    $subscribe(subscriber: (value: T) => void): void;
}
/**
 * Returns true if the given value is a reactive object (ReactiveValue, ReactiveArray, or ReactiveObject).
 */
export declare function isReactive(item: unknown): item is Reactive;
/**
 * One of the three types of reactive objects: ReactiveValue, ReactiveArray, or ReactiveObject.
 */
export type Reactive = ReactiveValue<unknown> | ReactiveArray<unknown> | ReactiveObject<object>;
/**
 * Converts a simple item (object, array, or other value) to its reactive representation.
 * If the item is already reactive, it is returned unchanged.
 */
export declare function createReactive(item: unknown): Reactive;
export interface BaseSubscription<T> extends Subscription<T> {
    $publish(value: T): void;
}
/**
 * A simple subscription object, with no automatic binding done.
 */
export declare function Subscription<T>(): BaseSubscription<T>;
export interface ReactiveValue<T> extends Subscription<T> {
    get(): T;
    set(value: T): void;
}
/**
 * A subscriptable value - like a variable with a subscription attached.
 * @example
 * const value = new ReactiveValue(10)
 * value.$subscribe(console.log)
 * value.get() // => 10
 * value.set(20) // logs 20
 * value.get() // => 20
 */
export declare function ReactiveValue<T>(initialValue: T): {
    $subscribe: (subscriber: (value: T) => void) => void;
    get(): T;
    set(newValue: T): void;
};
export interface ReactiveArray<T> extends Subscription<[number, T | undefined]> {
    get(index: number): T;
    set(index: number, value: T): void;
    push(value: T): void;
    pop(): T | undefined;
}
/**
 * A subscriptable array.
 * Acts as a proxy to a real array, but also holds a subscription.
 * @example
 * const array = new ReactiveArray(["a"])
 * array.$subscribe(console.log)
 * array.get(0) // => "a"
 * array.push("b") // logs [1, "b"]
 * array.pop() // logs [-1, "b"]
 * array.pop() // logs [-1, "a"]
 * array.pop() // logs [-1, undefined]
 */
export declare function ReactiveArray<T>(initialValue: T[]): ReactiveArray<T>;
export interface ReactiveObject<T> extends Subscription<[keyof T, T[keyof T]]> {
    get<K extends keyof T>(key: K): T[K];
    set<K extends keyof T>(key: K, value: T[K]): void;
    mutate<K extends keyof T>(key: K, updater: (value: T[K]) => T[K]): void;
}
/**
 * A subscriptable object.
 * Acts as a proxy to a real object, but also holds a subscription.
 * @example
 * const object = new ReactiveObject({a: 1, b: 2, c: [1, 2, 3]})
 * object.$subscribe(console.log)
 * object.get("a") // => 1
 * object.set("b", 3) // logs ["b", 3]
 * object.mutate("c", (arr) => arr.push(4)) // logs ["c", [1, 2, 3, 4]]
 */
export declare function ReactiveObject<T>(initialValue: T): ReactiveObject<T>;
