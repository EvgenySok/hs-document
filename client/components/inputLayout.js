import React, { useState, useEffect, useRef } from 'react'
import getCaretCoordinates from 'textarea-caret'
import { defineCaretPosition } from '../functions/define_caret_position'
import { inputMethods } from '../functions/input_methods'


const InputLayout = ({ text, setText, setAccumulatorChange, accumulatorChange, changeFromSocket, lastModified, inputLayoutId, rows, cols }) => {
  const [selectedText, setSelectedText] = useState('')
  const [caretPosition, setCaretPosition] = useState(0)
  const [topPos, setTopPos] = useState(0)
  const [leftPos, setLeftPos] = useState(0)
  const [maxTopPos, setMaxTopPos] = useState(0)
  const [maxLeftPos, setMaxLeftPos] = useState(0)
  const refText = useRef()

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
        if (change.inputName === inputLayoutId) {
          const { top, left } = change
          console.log('top, left :', top, left, lastModified.inputName, topPos !== 0, lastModified.inputName === { inputLayoutId })

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
      <label htmlFor={inputLayoutId} className="form__label ">{`${inputLayoutId} input`}</label>
      <div className="test_wrapper">

        <textarea
          value={text || ''}
          onChange={(e) => textChangeHandler(e)}
          onMouseUp={(e) => {
            const selected = inputMethods.getSelectedText()
            setSelectedText(selected)
            if (selected === '') {
              setCaretPosition(e.target.selectionEnd)
            }
          }}
          onDoubleClick={() => setSelectedText(inputMethods.getSelectedText())}
          ref={refText}
          type="text"
          name={inputLayoutId}
          id={inputLayoutId}
          className="form__field"
          rows={rows}
          cols={cols} />

        {topPos !== 0
          && lastModified.inputName === inputLayoutId
          && <span
            className="span_caret blink_me"
            style={{ top: topPos, left: leftPos }}
            title={lastModified.user}
          >_</span>}

      </div>
    </div>
  )
}

export default InputLayout
