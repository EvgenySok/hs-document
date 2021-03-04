import React, { useState, useEffect } from 'react'
import getCaretCoordinates from 'textarea-caret'
import { defineCaretPosition } from '../functions/define_caret_position'
import { inputMethods } from '../functions/input_methods'


const TextInput = ({ text, setText, refText, setAccumulatorChange, accumulatorChange, changeFromSocket, lastModified }) => {
  const [selectedText, setSelectedText] = useState('')
  const [caretPosition, setCaretPosition] = useState(0)
  const [topPos, setTopPos] = useState(0)
  const [leftPos, setLeftPos] = useState(0)
  const [maxTopPos, setMaxTopPos] = useState(0)
  const [maxLeftPos, setMaxLeftPos] = useState(0)

  const textChangeHandler = (e) => {
    e.preventDefault()
    const { top, left } = getCaretCoordinates(e.target, e.target.selectionEnd)
    setAccumulatorChange([...accumulatorChange, { ...inputMethods.identifyСhanges(e, text, selectedText, setSelectedText), top, left }])
    setText(e.target.value)
    const { maxTop, leftTop } = inputMethods.getMaxTopAndLeft(e)
    setMaxTopPos(maxTop)
    setMaxLeftPos(leftTop)
    setCaretPosition(e.target.selectionEnd)
  }

  useEffect(() => {
    changeFromSocket.forEach(change => {
      if (change) {
        const newPos = defineCaretPosition(change, caretPosition)
        setCaretPosition(newPos)
        if (change.inputName === 'text') {
          const { top, left } = change
          setTopPos(top)
          setLeftPos(left)
        }
      }
    })
  }, [changeFromSocket])

  useEffect(() => {
    setTopPos(Math.min(maxTopPos, topPos))
    setLeftPos(Math.min(maxLeftPos, leftPos))
  }, [maxTopPos, maxLeftPos])

  useEffect(() => {
    refText.current.setSelectionRange(caretPosition, caretPosition)
  }, [caretPosition, text])

  return (
    <div className="form__row " >
      <label htmlFor="text" className="form__label ">Text input</label>
      <div className="test_wrapper">

        <textarea
          value={text || ''}
          onChange={(e) => textChangeHandler(e)}
          onMouseUp={(e) => {
            const selected = inputMethods.getSelectedText

            setSelectedText(selected)
            if (typeof selected === 'undefined') {
              setCaretPosition(e.target.selectionEnd)
            }
          }}
          onDoubleClick={() => setSelectedText(inputMethods.getSelectedText)}
          ref={refText}
          type="text"
          name="text"
          id="text"
          className="form__field"
          rows="4"
          cols="50" />

        {topPos !== 0
          && lastModified.inputName === 'text'
          && <span
            className="span_caret blink_me"
            style={{ top: topPos, left: leftPos }}
            title={lastModified.user}
          >_</span>}

      </div>
    </div>
  )
}

export default TextInput
