import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'

let socket

const Home = () => {
  const [header, setHeader] = useState('')
  const [select, setSelect] = useState('')
  const [date, setDate] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    if (typeof socket === 'undefined') {
      socket = io(window.location.origin)
      socket.on('connect', () => {
        console.log(`connection established socket.id: ${socket.id}`)
      })
      socket.on('get document', (data) => {
        const document = JSON.parse(data)
        setHeader(document.header)
        setSelect(document.select)
        setDate(document.date)
        setText(document.text)
      })
      socket.on('change field', (data) => {
        const { fieldName, value, userId } = JSON.parse(data)
        switch (fieldName) {
          case 'text': {
            setText(value)
            break
          } case 'header': {
            setHeader(value)
            break
          } case 'select': {
            setSelect(value)
            break
          } case 'date': {
            setDate(value)
            break
          }
          default:
            break
        }
        console.log('userId:', userId)
      })
    }
  }, [])

  const formChangeHandler = (e) => {
    e.preventDefault()
    const fields = ['header', 'select', 'date', 'text']
    if (fields.includes(e.target.name)) {
      socket.emit('change', JSON.stringify({ fieldName: e.target.name, value: e.target.value, userId: socket.id }))
    }
    return null
  }

  return (
    <div className="wrapper">
      <h1>Creating a HS document</h1>
      <form onChange={formChangeHandler} className="" action="" method="post" data-validate>

        <div className="form__row">

          <label htmlFor="header" className="form__label">Text input</label>
          <input value={header} onChange={e => e.preventDefault()} type="text" name="header" id="header" className="form__field" required />

        </div>

        <div className="form__row">

          <label htmlFor="select" className="form__label">Select an option</label>
          <div className="custom-select form__field">

            <select value={select} onChange={e => e.preventDefault()} type="select" name="select" id="select" className="custom-select__field"
              data-error-required="This field is required" required>
              <option value="">Please select</option>
              <option value="H&P Note">H&P Note</option>
              <option value="Consult Note">Consult Note</option>
              <option value="Diagnostic Report">Diagnostic Report</option>
            </select>

          </div>

        </div>

        <div className="form__row">

          <label htmlFor="date" className="form__label">Date input</label>
          <input value={date} onChange={e => e.preventDefault()} data-error-required="This field is required" type="date" name="date" id="date" className="form__field"
            required />

        </div>

        <div className="form__row">

          <label htmlFor="text" className="form__label">Text input</label>
          <textarea value={text} onChange={e => e.preventDefault()} type="text" name="text" id="text" className="form__field" rows="4" cols="50" required />

        </div>

        <div className="form__action">

          <button type="submit">Submit</button>

        </div>

      </form>

    </div>
  )
}

export default Home
