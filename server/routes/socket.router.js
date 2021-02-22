const express = require('express')
const router = express.Router()

const returnRouter = (io) => {
  let usersOnline = []
  let document = {
    header: '',
    select: '',
    date: '',
    text: ''
  }
  // ================================================================================================
  io.on('connection', (socket) => {
    const userId = socket.id
    usersOnline.push(userId)
    socket.emit('get document', JSON.stringify(document))
    socket.broadcast.emit('new user', userId)
    console.log('connected id:', { userId })

    // ================================================================================================
    socket.on('change', (data) => {
      const { fieldName, value } = JSON.parse(data)
      document = { ...document, [fieldName]: value }
      console.log('console:', fieldName, value, document)

      io.emit('change field', data)
    })
    // ================================================================================================

    socket.on('disconnect', () => {
      usersOnline = usersOnline.filter((it) => it !== userId)
      console.log('usersOnline:', usersOnline)
    })
  })

  return router
}

module.exports = returnRouter
