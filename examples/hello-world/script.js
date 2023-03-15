const nameEl = document.getElementById("name")
const outputEl = document.getElementById("output")

const name = Reactivity.bindings.input(nameEl)
name.$subscribe(n => outputEl.textContent = n)
