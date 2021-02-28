export const inputMethods = {
  getCursorPosition: (e) => {
    return e.target.selectionStart
  },

  getSelectedText: () => window.getSelection().toString(),

  setCursorPosition: (ref, cursor) => {
    ref.current.selectionStart = cursor // eslint-disable-line no-param-reassign
    ref.current.selectionEnd = cursor // eslint-disable-line no-param-reassign
  },

  identifyСhanges: (e, oldInputValue, selectedText, setSelectedText) => {
    console.log('selectedText:', selectedText)

    const newValue = e.target.value
    const position = inputMethods.getCursorPosition(e)
    // no entiendo
    if (selectedText === '' && newValue === '') {
      return {
        action: 'remove all',
        time: +new Date(),
        inputName: e.target.name,
        value: '',
        position: 0,
      }
    }

    if (selectedText === '') {
      if (newValue.length === oldInputValue.length + 1) {
        const value = e.target.value[position - 1]
        return {
          action: 'one character added',
          time: +new Date(),
          inputName: e.target.name,
          value,
          position,
        }
      }
      if (newValue.length === oldInputValue.length - 1) {
        const value = oldInputValue[position]
        return {
          action: 'removed one character',
          time: +new Date(),
          inputName: e.target.name,
          value,
          position,
        }
      }

      if (newValue.length > oldInputValue.length) {
        const length = newValue.length - oldInputValue.length
        const value = e.target.value.slice(position - length, position)
        return {
          action: 'more than one character inserted',
          time: +new Date(),
          inputName: e.target.name,
          value,
          position,
        }
      }
    }

    // work with selected text
    else {
      console.log('selectedText:', selectedText)
      const replacedLength = selectedText.length                            // 3
      const changeLength = newValue.length - oldInputValue.length // > 0 || < 0  // -2
      const insertedValueLength = replacedLength + changeLength             // 1
      const insertedValue = newValue.slice(position - insertedValueLength, position) // 2 - 3 + 1 , 2
      console.log('console:', replacedLength, changeLength, insertedValueLength, insertedValue)
      setSelectedText('')
      return {
        action: 'work with selected text',
        time: +new Date(),
        inputName: e.target.name,
        value: insertedValue,
        position,
        replacedLength,
      }
    }

    return new Error('identifyСhanges')
  }


}

export const changeHandler = (oneСhange, oldValue) => {
  let newValue
  const startingPositionTextChange = oneСhange.position - oneСhange.value.length
  if (oneСhange.action === 'one character added') {
    if (oldValue[startingPositionTextChange]) {
      newValue = [
        ...[...oldValue].filter((it, id) => id < startingPositionTextChange),
        oneСhange.value,
        ...[...oldValue].filter((it, id) => id >= startingPositionTextChange)]
    } else {
      newValue = new Array(oneСhange.position).fill(' ')
      newValue = newValue.map((it, id) => typeof oldValue[id] === 'undefined' ? '' : oldValue[id])
      newValue[startingPositionTextChange] = oneСhange.value
    }
  }
  if (oneСhange.action === 'removed one character') {
    if (oldValue[oneСhange.position]) {
      newValue = [
        ...[...oldValue].filter((it, id) => id < oneСhange.position),
        ...[...oldValue].filter((it, id) => id > oneСhange.position)
      ]
    }
    // else {
    // }
  }
  if (oneСhange.action === 'one character changed') {
    if (oldValue[startingPositionTextChange]) {
      newValue = [
        ...[...oldValue].filter((it, id) => id < startingPositionTextChange),
        oneСhange.value,
        ...[...oldValue].filter((it, id) => id > startingPositionTextChange)]
    }
    // else {
    // }
  }

  if (oneСhange.action === 'more than one character inserted') {
    if (oldValue[startingPositionTextChange]) {
      newValue = [
        ...[...oldValue].filter((it, id) => id < startingPositionTextChange),
        oneСhange.value,
        ...[...oldValue].filter((it, id) => id >= startingPositionTextChange)]
    }
    else {
      newValue = [oldValue, oneСhange.value]
    }
  }

  if (oneСhange.action === 'more than one character removed') {
    if (oldValue[oneСhange.position]) {
      newValue = [
        ...[...oldValue].filter((it, id) => id < oneСhange.position),
        ...[...oldValue].filter((it, id) => id >= oneСhange.position + oneСhange.value.length)]
    }
    else {
      newValue = [oldValue, oneСhange.value]
    }
  }

  if (oneСhange.action === 'work with selected text') {
    const startPosition = oneСhange.position - oneСhange.value.length
    newValue = [...oldValue]
      .map((it, id) => {
        return id >= startPosition && id <= startPosition + oneСhange.replacedLength - 1 ? '' : it
      })
      .map((it, id) => {
        return oneСhange.value[id - startPosition] ? oneСhange.value[id - startPosition] : it
      })

  }

  if (oneСhange.action === 'remove all') {
    return []
  }

  return newValue.join('')
}
