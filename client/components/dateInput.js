import React from 'react'

const DateInput = ({date, setDate}) => {

  return (
    <div className="form__row">
      <label htmlFor="date" className="form__label">Date input</label>
      <input value={date || ''} onChange={(e) => setDate(e.target.value)} data-error-required="This field is required" type="date" name="date" id="date" className="form__field"
        required />
    </div>
  )
}

export default DateInput
