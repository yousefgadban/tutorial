require('dotenv').config();
const express = require('express')
const app = express();
const mongoose = require('mongoose')
const User = require('./users')
const Subscriber = require('./models/subscribers')

mongoose.connect(process.env.DATABASE_URL,  { useNewUrlParser: true, useUnifiedTopology: true  })
const db = mongoose.connection

db.once('open', async () => {
    console.log('connected to database')
})

app.listen(3000 , () => {
    console.log('server started');
});

app.use(express.json())


const subscribersRouter = require('./routes/subscribers')
const usersRouter = require('./routes/users')
app.use('/subscribers', subscribersRouter)
app.use('/users', usersRouter)



app.get('/userssss', paginatedResults(User), (req, res) => {

    res.json(res.paginatedResults)

}) 


function paginatedResults(model) {
    return async (req, res, next) => {

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page - 1) * limit 
        const endIndex = page * limit 

        const results = {}

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page : page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page : page - 1,
                limit: limit
            }
        }

        // results.results = model.slice(startIndex, endIndex);

        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
        

        

    }
}




// Update user fields
app.get('/updateFields', async (req,res) => {

    console.log('updateFields')

    let id = "6102fc4705194488aa480703";

    try {
        //const subscriber = await Subscriber.find({_id : "6102fc4705194488aa480703"})
        const updatdSubscriber = await Subscriber.updateOne(
            {"_id" : "6102fc1a05194488aa4806f7" },
            {$set : {"newField":"newField 111"}}
        )

        //subscriber.newField = "newField 111"

        //const updatdSubscriber = {} // await res.subscriber.save()

        res.json(updatdSubscriber)
    } catch (err) {
        return res.status(400).json({ message : err.message })
    }

}) 


// Update All users fields
app.get('/updateAllFields', async (req,res) => {

    console.log('updateAllFields')

    try {

        const subscribers = await Subscriber.find({ newField: {$exists:true} })

        for (let i = 0 ; i < subscribers.length ; i ++) {
            console.log('subscriber ' + subscribers[i].name);

            
                // let id = subscribers[i]._id;
                // const updatdSubscriber = await Subscriber.updateOne(
                //     {"_id" : id },
                //     {$set : {"newField":"newField 222"}}
                // )
            

        }

        res.json(subscribers)
    } catch (err) {
        return res.status(400).json({ message : err.message })
    }

})