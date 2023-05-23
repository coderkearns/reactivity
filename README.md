# reactivity

My personal reactivity library.

Heavily based on the **Observer** (also known as **Subscription**) design pattern.

## Getting Started

### Installing

You can install from npm:

```
$ npm install -s @coderkearns/reactivity
```

Or directly from this repository for bleeding-edge features:

```
$ npm install -s git+github.com/coderkearns/reactivity
```

## Docs

The core of [reactivity](https://github.com/coderkearns/reactivity) is based around `.$subscribe()` functions.

### Core Subscriptions

A subscription is stores an array of listeners registered via `.$subscribe()`, and notifies them via `.$publish()`

```ts
import { subscription } from "@coderkearns/reactivity"

const mySubscription = subscription<string>()

mySubscription.$subscribe((message) => {
    // Typescript knows `message` is a `string`
    console.log(message);
})

mySubscription.$subscribe((message) => {
    fs.writeFileSync("mySubscriptionLog.txt", message);
})

mySubscription.$publish("This is a message") // Logs "This is a message" to both the console and the file

```

### `Reactive`s

Each reactive represents a type of values (objects, arrays, or any other value) with subscription attached.

```ts
import { reactiveValue } from "@coderkearns/reactivity"

// Example 1: using `ReactiveValues`s as subscribable variables
const count = reactiveValue(0)

count.$subscribe((newCount) => {
    console.log(`Count is now ${newCount}!`)
})

const countButton = document.querySelector("button")
countButton.onclick = () => count.set(count.get() + 1)
```

```ts
import { reactiveArray } from "@coderkearns/reactivity"

// Example 2: using `ReactiveArray`s as lists you can track
const todos = reactiveArray<{ name: string, done: boolean }>([
    { name: "Write the code", done: true },
    { name: "Write the docs", done: false }
])

todos.$subscribe(([index, newTodo]) => {
    if (index === -1) {
        console.log("Todo removed:", newTodo)
    } else {
        console.log("Todo changed or added at index", index, "=", newTodo)
    }
})

todos.get(1) // => { name: "Write the docs", done: false }
todos.set(1, { name: "Write the docs", done: true })
todos.push({ name: "Todo #3", done: false })
todos.pop() // => { name: "Todo #3", done: false }
```

```ts
import { reactiveObject } from "@coderkearns/reactivity"

// Example 3: using `ReactiveObject`s as settings with save functionality
const settings = reactiveObject<{
   title: string,
   content: string,
   saved: boolean,
   tags: string[]
}>({
    title: "Untitled Note",
    content: "This note has no content",
    tags: ["examples", "empty"],
    saved: false
})

const titleInput = document.getElementById("title")
const contentInput = document.getElementById("content")
const saveButton = document.getElementById("save")

titleInput.oninput = () => {
    settings.set("title", titleInput.value)
}

contentInput.oninput = () => {
    settings.set("content", contentInput.value)
}

settings.$subscribe(([key, value]) => {
    if (key !== "saved") {
        settings.set("saved", false)
        fetch("/save/note/or/whatever").then(() => settings.set("saved", true))
    }
})

```

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License - see the [LICENSE](./LICENSE) file for details.
