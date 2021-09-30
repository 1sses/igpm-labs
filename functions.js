function createH2(text, dest) {
  const elem = document.createElement('h2')
  elem.classList.add('task__header')
  elem.innerHTML = text
  dest.append(elem)
}

function createInput(text, dest) {
  const elem = document.createElement('input')
  elem.classList.add('task-input')
  elem.setAttribute('type', 'number')
  text && elem.setAttribute('placeholder', text)
  dest.append(elem)
  return elem
}

function createInputSq(dest, text) {
  const input = document.createElement('input')
  text && (input.value = text)
  input.classList.add('task-input-sq')
  dest.append(input)
}

function createButton(text, id, dest) {
  const elem = document.createElement('button')
  elem.classList.add('task-button')
  id && elem.setAttribute('id', id)
  elem.innerText = text
  dest.append(elem)
  return elem
}

function createBr(dest) {
  dest.append(document.createElement('br'))
}