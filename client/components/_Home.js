import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
// import HeaderInput from './headerInput'
import SelectInput from './selectInput'
import DateInput from './dateInput'
import TextInput from './textInput'
import InputLayout from './inputLayout'

import Loader from './loader'

import ListUsers from './listUsers'
import changeHandler from '../functions/change_handler'

let socket

const Home = (props) => {
  const [currentUser, setCurrentUsers] = useState('')
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false)
  const [users, setUsers] = useState([])
  const [delUsers, setDelUsers] = useState([])
  const [addUser, setAddUser] = useState([])

  const [accumulatorChange, setAccumulatorChange] = useState([])
  const [changeFromSocket, setChangeFromSocket] = useState([])
  const [lastModified, setLastModified] = useState({ field: '', user: '' })
  const [header, setHeader] = useState('')
  const [select, setSelect] = useState('')
  const [date, setDate] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    setCurrentUsers(props.location.user)

    if (typeof socket === 'undefined') {
      socket = io(window.location.origin)
      socket.on('connect', () => {
        console.log(`connection established socket.id: ${socket.id}`)
        socket.emit('get current user', props.location.user)
      })
      socket.on('get document', (data) => {
        setHeader(data.header)
        setSelect(data.select)
        setDate(data.date)
        setText(data.text)
        setIsDocumentLoaded(true)
      })
      socket.on('get users', (usersOnline) => {
        setUsers(usersOnline)
      })
      socket.on('user connected', (userId) => {
        setAddUser(userId)
      })
      socket.on('user disconnected', (userId) => {
        setDelUsers(userId)
      })
      socket.on('change', (data) => {
        setChangeFromSocket(data)
      })
    }

  }, [])

  useEffect(() => {
    if (delUsers) {
      setUsers([...users.filter(user => user !== delUsers)])
      setDelUsers('')
    }
    if (addUser) {
      setUsers([...users, addUser])
      setAddUser('')
    }
    if (isDocumentLoaded && accumulatorChange.length) {
      socket.emit('change', accumulatorChange)
      setAccumulatorChange([])
    }
  }, [accumulatorChange, delUsers, addUser])

  useEffect(() => {
    changeFromSocket.forEach((oneСhange) => {
      switch (oneСhange.inputName) {
        case 'text': {
          const newValue = changeHandler(oneСhange, text)
          setText(newValue)
          break
        }
        case 'header': {
          const newValue = changeHandler(oneСhange, header)
          setHeader(newValue)
          break
        }
        case 'select': {
          setSelect(oneСhange.value)
          break
        } case 'date': {
          setDate(oneСhange.value)
          break
        }
        default:
          break
      }
      setLastModified(oneСhange)
    })
  }, [changeFromSocket])



  return (
    <>
      <div className="wrapper">
        <h1>Creating a HS document</h1>
        {isDocumentLoaded ?
          <form className="" action="" method="post" data-validate>
            {/* <HeaderInput header={header} setHeader={setHeader} /> */}
            <InputLayout
              text={header}
              setText={setHeader}
              setAccumulatorChange={setAccumulatorChange}
              accumulatorChange={accumulatorChange}
              changeFromSocket={changeFromSocket}
              currentUser={currentUser}
              lastModified={lastModified}
              inputLayoutId='header'
              rows={1}
              cols={50} />
            <SelectInput
              select={select}
              setSelect={setSelect}
              accumulatorChange={accumulatorChange}
              setAccumulatorChange={setAccumulatorChange}
              lastModified={lastModified} />
            <DateInput
              date={date}
              setDate={setDate}
              accumulatorChange={accumulatorChange}
              setAccumulatorChange={setAccumulatorChange}
              lastModified={lastModified} />
            <TextInput
              text={text}
              setText={setText}
              setAccumulatorChange={setAccumulatorChange}
              accumulatorChange={accumulatorChange}
              changeFromSocket={changeFromSocket}
              currentUser={currentUser}
              lastModified={lastModified}
            />
            <div className="form__action">
              <button type="submit">Submit</button>
            </div>
          </form> :
          <Loader />}
      </div>
      <ListUsers users={users} currentUser={currentUser} />
    </>
  )
}

export default Home