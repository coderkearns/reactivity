import { Subscription, ReactiveValue, ReactiveObject } from "./core";
export function event(base, event) {
    var _subscription = Subscription();
    base.addEventListener(event, function (e) { return _subscription.$publish(e); });
    return _subscription;
}
export function input(inputEl, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.transform, transform = _c === void 0 ? function (value) { return value; } : _c;
    var _reactiveValue = ReactiveValue(transform(inputEl.value));
    inputEl.addEventListener("input", function (e) { return _reactiveValue.set(transform(e.target.value)); });
    return _reactiveValue;
}
export function form(formEl) {
    var inputs = Array.from(formEl.querySelectorAll("[name]"));
    var _reactiveObject = ReactiveObject(Object.fromEntries(inputs.map(function (input) { return [input.name, input.value]; })));
    inputs.forEach(function (input) { return input.addEventListener("input", function (e) { return _reactiveObject.set(input.name, e.target.value); }); });
    _reactiveObject.$subscribe(function (_a) {
        var key = _a[0], value = _a[1];
        var inpEl = inputs.find(function (inp) { return inp.name === key; });
        if (!inpEl)
            return;
        if (value !== inpEl.value)
            inpEl.value = value;
    });
    return _reactiveObject;
}
