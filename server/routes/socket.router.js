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
  console.log('document:', document)

  // ================================================================================================
  io.on('connection', (socket) => {
    const userId = socket.id
    usersOnline.push(userId)
    socket.emit('get document', JSON.stringify(document))
    // socket.broadcast.emit('new user', userId)
    console.log('connected id:', { userId })
    console.log('document:', document)

    // ================================================================================================
    socket.on('change', (data) => {
      if (data) {
        const dataWithUserId = data.map(it => ({ ...it, userId }))
        console.log('console:', dataWithUserId)
        
        socket.broadcast.emit('change', dataWithUserId)
      }
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
