const express = require('express')
const bodyParser = require('body-parser')
const documentRouter = require('./routes/document.router')
const socketRouter = require('./routes/socket.router')
const socketIo = require('socket.io')
const { resolve } = require('path')

require('dotenv').config()
const PORT = process.env.PORT || 5000
const server = express()

server.use(express.static(resolve(__dirname, '../dist')))

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))

const app = server.listen(PORT, () => {
  console.log(`Server has been started at http://localhost:${PORT}...`)
})
const io = socketIo(app)

server.use('/socket.io', socketRouter(io)) 
server.use('/api/v1', documentRouter)


