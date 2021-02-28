import React from 'react'

const HeaderInput = ({ header, setHeader }) => {




  return (
    <div className="form__row">
      <label htmlFor="header" className="form__label">Header input</label>
      <input value={header || ''} onChange={(e) => setHeader(e.target.value)} type="text" name="header" id="header" className="form__field" required />
    </div>
  )
}

export default HeaderInput
