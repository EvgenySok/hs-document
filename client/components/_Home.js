import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import HeaderInput from './headerInput'
import SelectTypeDocument from './selectTypeDoc'
import DateInput from './dateInput'
import TextInput from './textInput'
import Loader from './loader'
import { changeHandler } from '../functions'



let socket

const Home = () => {
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false)

  const [accumulatorChange, setAccumulatorChange] = useState([])
  const [changeFromSocket, setChangeFromSocket] = useState([])
  const [header, setHeader] = useState('')
  const [select, setSelect] = useState('')
  const [date, setDate] = useState('')
  const [text, setText] = useState('')
  const refText = useRef()

  useEffect(() => {
    if (typeof socket === 'undefined') {
      socket = io(window.location.origin)
      socket.on('connect', () => {
        console.log(`connection established socket.id: ${socket.id}`)
      })
      socket.on('get document', (data) => {
        const doc = JSON.parse(data)
        setHeader(doc.header)
        setSelect(doc.select)
        setDate(doc.date)
        setText(doc.text)
        setIsDocumentLoaded(true)
      })
      socket.on('change', (data) => {
        setChangeFromSocket(data)
      })
    }
  }, [])

  useEffect(() => {
    console.log('console:', isDocumentLoaded, accumulatorChange.length)
    if (isDocumentLoaded && accumulatorChange.length) {
      socket.emit('change', accumulatorChange)
      setAccumulatorChange([])
    }
  }, [accumulatorChange])

useEffect(() => {
  changeFromSocket.forEach((oneСhange) => {
    switch (oneСhange.inputName) {
      case 'text': {
        const newText = changeHandler(oneСhange, text)
        setText(newText)
        break
      }
      // case 'header': {
      //     setHeader(fieldValue)
      //     break
      //   } case 'select': {
      //     setSelect(fieldValue)
      //     break
      //   } case 'date': {
      //     setDate(fieldValue)
      //     break
      //   }
      default:
        break
    }
  })
}, [changeFromSocket])
  


  return (
    <div className="wrapper">
      <h1>Creating a HS document</h1>
      {isDocumentLoaded ?
        <form className="" action="" method="post" data-validate>
          <HeaderInput header={header} setHeader={setHeader} />
          <SelectTypeDocument select={select} setSelect={setSelect} />
          <DateInput date={date} setDate={setDate} />
          <TextInput
            text={text}
            setText={setText}
            refText={refText}
            setAccumulatorChange={setAccumulatorChange}
            accumulatorChange={accumulatorChange}
            changeFromSocket={changeFromSocket}
          />
          <div className="form__action">
            <button type="submit">Submit</button>
          </div>
        </form> :
        <Loader />}
    </div>
  )
}

export default Home