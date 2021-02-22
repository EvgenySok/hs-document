const Router = require('express')
const router = new Router()
const DocumentController = require('../db/controller/document.controller')


router.post('/document', DocumentController.createDocument)
router.get('/document/:id', DocumentController.getOneDocument)
router.get('/document', DocumentController.getDocuments)
router.put('/document', DocumentController.updateDocument)
router.delete('/document/:id', DocumentController.deleteDocument)


module.exports = router