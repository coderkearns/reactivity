import { Subscription, ReactiveValue, ReactiveObject } from "./core";
interface EventEmitter {
    addEventListener(event: string, listener: (...args: any[]) => void): void;
}
export declare function event<Event>(base: EventEmitter, event: string): Subscription<Event>;
type InputOptions<T> = {
    transform?: (value: any) => T;
};
export declare function input<T>(inputEl: EventEmitter & {
    value: any;
}, { transform }?: InputOptions<T>): ReactiveValue<T>;
export declare function form<T extends {
    [key: string]: any;
}>(formEl: EventEmitter & {
    querySelectorAll: (selector: string) => NodeListOf<Element>;
}): ReactiveObject<T>;
export {};
