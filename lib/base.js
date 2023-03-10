export function subscription() {
    const subscribers = []
    return {
        $SUBSCRIPTION: true,
        $subscribe(subscriber) {
            subscribers.push(subscriber)
        },
        $publish(...data) {
            subscribers.forEach(subscriber => subscriber(...data))
        },
    }
}

export function makeSubscription(value) {
    if (typeof value === "object") {
        if (Array.isArray(value)) {
            return group(value)
        } else {
            return store(value)
        }
    }

    return reactive(value)
}

export function reactive(value) {
    const { $subscribe, $publish } = subscription()
    return {
        $SUBSCRIPTION: true,
        $subscribe,
        $static() {
            return value
        },
        $get() {
            return value
        },
        $set(newValue) {
            value = newValue
            $publish(newValue)
        }
    }
}

export function group(initial = []) {
    const { $subscribe, $publish } = subscription()

    const _group = []

    for (let i = 0; i < initial.length; i++) {
        const item = makeSubscription(initial[i])
        _group.push(item)
        item.$subscribe((newValue, keyParts) => {
            $publish(newValue, keyParts ? `${i}.${keyParts}` : `${i}`)
        })
    }

    _group.$SUBSCRIPTION = true
    _group.$subscribe = $subscribe
    _group.$static = function () {
        return _group.map(item => item.$static())
    }
    _group.$mutate = function (fn) {
        fn(_group)
        for (let i = 0; i < _group.length; i++) {
            if (!_group[i].$SUBSCRIPTION) {
                _group[i] = makeSubscription(_group[i])
            }
        }
        $publish(_group.$static())
    }

    return _group
}

export function store(initial = {}) {
    const { $subscribe, $publish } = subscription()

    const _store = {}

    for (const key in initial) {
        _store[key] = makeSubscription(initial[key])
        _store[key].$subscribe((newValue, keyParts) => {
            $publish(newValue, keyParts ? `${key}.${keyParts}` : key)
        })
    }

    _store.$SUBSCRIPTION = true
    _store.$subscribe = $subscribe
    _store.$static = function () {
        const _static = {}
        for (const key in _store) {
            if (!key.startsWith("$")) {
                _static[key] = _store[key].$static()
            }
        }
        return _static
    }
    _store.$set = function (key, value) {
        _store[key] = makeSubscription(value)
        _store[key].$subscribe((newValue, keyParts) => {
            $publish(newValue, keyParts ? `${key}.${keyParts}` : key)
        })
        $publish(_store[key].$static(), key)
    }

    return _store
}
