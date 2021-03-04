export const defineCaretPosition = (change, caretPosition) => {
  if (change.action === 'remove all') {
    return 0
  }
  if (change.action === 'one character added') {
    return change.position < caretPosition ? caretPosition + 1 : caretPosition
  } if (change.action === 'removed one character') {
    return change.position <= caretPosition ? caretPosition - 1 : caretPosition
  } if (change.action === 'more than one character inserted') {
    return change.position < caretPosition ? caretPosition + change.value.length : caretPosition
  } if (change.action === 'work with selected text') {
    const startPosition = change.position - change.value.length
    if (startPosition <= caretPosition < startPosition + change.replacedLength) {
      return startPosition
    }
    if (caretPosition < startPosition) {
      return caretPosition
    }
    if (caretPosition >= startPosition + change.replacedLength) {
      return caretPosition + change.value.length
    }
  }
  return caretPosition
}
