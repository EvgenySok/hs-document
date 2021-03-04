const changeHandler = (oneСhange, oldValue) => {
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
  }
  if (oneСhange.action === 'one character changed') {
    if (oldValue[startingPositionTextChange]) {
      newValue = [
        ...[...oldValue].filter((it, id) => id < startingPositionTextChange),
        oneСhange.value,
        ...[...oldValue].filter((it, id) => id > startingPositionTextChange)]
    }
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

module.exports = changeHandler