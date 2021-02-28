import React, { useState, useEffect } from 'react'
import getCaretCoordinates from 'textarea-caret'

import { inputMethods } from '../functions'

const TextInput = ({ text, setText, refText, setAccumulatorChange, accumulatorChange, changeFromSocket }) => {
  const [selectedText, setSelectedText] = useState('')
  const [caretPosition, setCaretPosition] = useState(0)
  const [topPos, setTopPos] = useState(0)
  const [leftPos, setLeftPos] = useState(0)

  useEffect(() => {
    changeFromSocket.forEach(change => {
      const { top, left } = change
      setTopPos(top)
      setLeftPos(left - 7)
    })

  }, [changeFromSocket])

  return (
    <div className="form__row " >
      <label htmlFor="text" className="form__label ">Text input</label>
      <div className="test_wrapper">
        <textarea
          value={text || ''}
          onChange={(e) => {
            e.stopPropagation()
            const { top, left } = getCaretCoordinates(e.target, e.target.selectionEnd)
            setAccumulatorChange([...accumulatorChange, { ...inputMethods.identifyСhanges(e, text, selectedText, setSelectedText), top, left }])
            setText(e.target.value)
            setCaretPosition(e.target.selectionStart + 1)
            refText.current.setSelectionRange(caretPosition, caretPosition)
          }}
          onMouseUp={() => setSelectedText(inputMethods.getSelectedText)}
          onDoubleClick={() => setSelectedText(inputMethods.getSelectedText)}
          ref={refText}
          type="text"
          name="text"
          id="text"
          className="form__field"
          rows="4"
          cols="50"
          required />
        <span className="span_caret" style={{ top: topPos, left: leftPos }}>_</span>
      </div>
    </div>
  )
}

export default TextInput
