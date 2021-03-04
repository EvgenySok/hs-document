import React from 'react'
import { inputMethods } from '../functions/input_methods'

const DateInput = ({ date, setDate, accumulatorChange, setAccumulatorChange, lastModified }) => {

  return (
    <div className="form__row">
      <label htmlFor="date" className="form__label">Date input</label>
      <input type="date" name="date" id="date"
        className={`form__field ${lastModified.inputName === 'date' ? 'modified' : ''}`}
        value={date || ''}
        onChange={(e) => {
          setAccumulatorChange([...accumulatorChange, { ...inputMethods.identifyСhanges(e) }])
          setDate(e.target.value)
        }}

      />
    </div>
  )
}

export default DateInput
