const express = require('express')
const controller = require('../controller/controller')
const route = express.Router()

route.post('/createCategory',controller.createCategory)
route.delete('/deleteCategory/:id',controller.deleteCategory)
route.get('/categories',controller.getCategories)

route.post('/createItem',controller.createItem)
route.put('/updateItem/:id',controller.updateItem)
route.delete('/deleteItem/:id',controller.deleteItem)
route.get('/items/:categoryId',controller.getItemsByCategory)
route.get('/item/:id', controller.getItemById);

route.post('/createUser',controller.createUser)
route.put('/updateUser/:id',controller.updateUser)
route.delete('/deleteUser/:id',controller.deleteUser)
route.get('/user',controller.getUsers)
route.post('/userlogin', controller.getUserlogin)
route.get('/checkMail/:email',controller.checkMail)

route.post('/purchase',controller.createPurchase)
route.get('/getHistoryadmin/:userId',controller.getPurchaseHistory)

route.get('/test', (req, res) => {
    res.send('Test route works!');
});

module.exports = route