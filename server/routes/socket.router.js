const express = require('express')
const changeHandler = require('../../client/functions/change_handler')
const router = express.Router()
const { readFile } = require('fs').promises

const returnRouter = (io) => {
  let usersOnline = []
  let equalize
  let document = {
    header: '',
    select: '',
    date: '',
    text: ''
  }
  console.log('document:', document)

  // ================================================================================================
  io.on('connection', (socket) => {
    let user
    socket.on('get current user', currentUser => {
      user = currentUser
      usersOnline.push(currentUser)
      socket.emit('get document', document)
      socket.emit('get users', usersOnline)
      socket.broadcast.emit('user connected', user)

      console.log('connected user and him id:', user, socket.id)
    })

    // ================================================================================================
    socket.on('change', (data) => {
      if (data) {
        clearTimeout(equalize)
        const dataWithUserId = data.map(it => ({ ...it, user }))
        console.log('console:', dataWithUserId)
        socket.broadcast.emit('change', dataWithUserId)
        document = updateDocument(document, data)
        equalize = setTimeout((document) => {
          io.emit("get document", document);
          console.log('tick')
        }, 500, document)
      }
    })
    // ================================================================================================
    socket.on('disconnect', () => {
      usersOnline = usersOnline.filter((it) => it !== user)
      socket.broadcast.emit('user disconnected', user)
      console.log('usersOnline:', usersOnline)
    })
  })
  return router
}

module.exports = returnRouter

function updateDocument(doc, data) {
  data.forEach((oneСhange) => {
    switch (oneСhange.inputName) {
      case 'text': {
        const newValue = changeHandler(oneСhange, doc.text)
        doc = { ...doc, text: newValue }
      }
      case 'header': {

        break
      } case 'select': {
        doc = { ...doc, select: oneСhange.value }
        break
      } case 'date': {
        doc = { ...doc, date: oneСhange.value }
        break
      }
      default:
        break
    }
  })
  return doc
}