import getCaretCoordinates from 'textarea-caret'

export const inputMethods = {
  getCursorPosition: (e) => {
    return e.target.selectionStart
  },

  getSelectedText: () => window.getSelection().toString(),

  getMaxTopAndLeft: (e) => {
    const lastPos = e.target.selectionStart
    e.target.selectionStart = e.target.value.length
    e.target.selectionEnd = e.target.value.length
    const { top, left } = getCaretCoordinates(e.target, e.target.selectionEnd)
    e.target.selectionStart = lastPos
    e.target.selectionEnd = lastPos
    return { maxTop: top, leftTop: left }
  },

  setCursorPosition: (ref, cursor) => {
    ref.current.selectionStart = cursor // eslint-disable-line no-param-reassign
    ref.current.selectionEnd = cursor // eslint-disable-line no-param-reassign
  },

  identifyСhanges: (e, oldInputValue, selectedText, setSelectedText) => {
    const newValue = e.target.value
    const position = inputMethods.getCursorPosition(e)
    if (e.target.name === "select" || e.target.name === "date") {
      return {
        inputName: e.target.name,
        time: +new Date(),
        value: newValue,
      }
    }
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
      const insertedValue = newValue.slice(position - insertedValueLength, position) 
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