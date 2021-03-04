const express = require('express')
const router = express.Router()
const { readFile, writeFile } = require('fs').promises
const { resolve } = require('path')


const SigninValidateSchema = require('../../validate/authValidate')
const path = resolve(__dirname, '../db/users.json')
router.post('/', async (req, res) => {

  try {
    const validatedData = await SigninValidateSchema.validate(req.body, { abortEarly: false })

    const { email, password } = validatedData

    let users = await readFile(path, { encoding: 'utf8' }).then((text) => {
      return JSON.parse(text)
    })

    const user = users.filter(it => it.email === email)

    if (user.length === 0) {
      users = [...users, validatedData]
      await writeFile(path, JSON.stringify(users), { encoding: 'utf8' })
      return res.status(201).json({ success: 'Login successful.', user: email })
      // redirect with delay
    }

    const isMatch = password === user[0].password

    if (!isMatch) {
      return res.status(403).json({ error: 'Is at least one field filled in incorrectly' })
    }

    return res.status(201).json({ success: 'Login successful.', user: email })
    // redirect with delay

  } catch (error) {
    if (error.name === 'ValidationError') {
      const errorsForFormik = error.inner.reduce((acc, it) => ({ ...acc, [it.path]: it.errors.join(' ') }), {})
      return res.status(403).json(errorsForFormik)
    }
    console.log('error:', error)

    res.status(403).json([{
      msg: 'Error while sign in user on the server.',
      param: 'error',
      error: error.message,
      error,
    }])
  }
})

module.exports = router
