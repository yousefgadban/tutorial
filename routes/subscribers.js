const express = require('express')
const router = express.Router()
const Subscriber = require('../models/subscribers')

module.exports = router

// Get all users
router.get('/', async (req,res) => {
    
    try {
        const subscribers = await Subscriber.find()
        res.json(subscribers)
    } catch (err) {
        res.status(500).json({ message : err.message})
    }
})


// Get user 
// router.get('/:id', getSubscriber, (req,res) => {
//     res.send(res.subscriber)
// })


// Create user
router.post('/', async (req,res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel,
        newField: req.body.newField 
    })

    try {
        const newSubscriber = await subscriber.save()
        res.status(201).json(newSubscriber)
    } catch (err) {
        console.log('error creating a user')
        res.status(400).json({ message: err.message})
    }
})


// Update user
router.patch('/:id', getSubscriber, async (req,res) => {

    console.log('patch ');

    if (req.body.name != null) {  
        res.subscriber.name = req.body.name
    }
    if (req.body.subscribedToChannel != null) {
        res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }
    if (req.body.newField != null) {
        res.subscriber.newField = req.body.newField
    }

    try {
        const updatdSubscriber = await res.subscriber.save()
        res.json(updatdSubscriber)
    } catch (err) {
        return res.status(400).json({ message : err.message })
    }

})  


// Delete user
router.delete('/:id', getSubscriber, async (req,res) => {

    try {
        await res.subscriber.remove()
        res.json({ messsage : 'Deleted subscriber' })
    } catch (err) {
        return res.status(500).json({ message : err.message })
    }
})


// Update user fields
router.get('/subUpdateFields', async (req,res) => {

    console.log('updateFields')

    // try {
    //     const subscribers = await Subscriber.find()
    //     res.json(subscribers)
    // } catch (err) {
    //     res.status(500).json({ message : err.message })
    // }

    res.json({})

}) 

router.get('/getUserById', async (req,res) => {

    let id = req.query.id
    console.log('getUserById ' + id)

    try {
        const subscriber = await Subscriber.findById(id)
        res.json(subscriber)
    } catch (err) {
        res.status(404).json({ message : err.message })
    }

    // res.json(subscriber)

})


router.get('/queryData', async (req,res) => {

    console.log('queryData ')

    try {
        const subscribers = await Subscriber.find({newField : "newField 333"})
        res.json(subscribers)
    } catch (err) {
        res.status(404).json({ message : err.message })
    }


}) 


async function getSubscriber(req, res, next) {
    
    let subscriber
    try {
        subscriber = await Subscriber.findById(req.params.id)
        if (subscriber == null) {
            return res.status(404).json({ message : 'Cannot find subscriber' })
        }
    } catch (err) {
        return res.status(500).json({ message : err.message })
    }

    res.subscriber = subscriber
    next() 

}