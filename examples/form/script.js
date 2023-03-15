const formEl = document.getElementById("myForm")
const outputEl = document.getElementById("output")

const form = Reactivity.bindings.form(formEl)

form.$subscribe(() => {
    outputEl.textContent = JSON.stringify(form.$static())
})
