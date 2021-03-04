import React from 'react'
import { inputMethods } from '../functions/input_methods'

const SelectInput = ({ select, setSelect, accumulatorChange, setAccumulatorChange, lastModified }) => {




  return (
    <div className="form__row">

      <label htmlFor="select" className="form__label">Select an option</label>
      <div
        className={`custom-select form__field ${lastModified.inputName === 'select' ? 'modified' : ''}`}>

        <select value={select || ''} onChange={(e) => {
          setAccumulatorChange([...accumulatorChange, { ...inputMethods.identifyСhanges(e) }])
          setSelect(e.target.value)
        }} type="select" name="select" id="select"
          className="custom-select__field"
          data-error-required="This field is required" required>
          <option value="">Please select</option>
          <option value="H&P Note">H&P Note</option>
          <option value="Consult Note">Consult Note</option>
          <option value="Diagnostic Report">Diagnostic Report</option>
        </select>

      </div>

    </div>
  )
}

export default SelectInput
