const express = require('express');
const app = express();
const mongoose = require('./database/mongoose');

//databases
const TaskList = require('./database/models/tasklist');
const Task = require('./database/models/task');

// Add headers 
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

app.use(express.json()); //3rd party body parser

//Routes or REST API EndPoints or RESTFUL webservices EndPoints

/**
 * TaskList - created, Updated, ReadById, ReadAll
 * Task - created, Updated, ReadById, ReadAll
*/

// Routes TaskList API

    //Get All Task Lists
    // http:localhost:3000/tasklist => [{TaskList}, {TaskList}, {TaskList}]

    app.get('/tasklists', (req, res)=> { 
        
        TaskList.find({})
            
            .then( (lists) => {res.status(200).send(lists)} )

            .catch((error) => console.log(error));
    } );

    //EndPoints for createing a TaskList
    app.post('/tasklists', (req, res) => {
        //console.log('hello i am inside post methode');

        const savedPost = new TaskList({
        "title" : req.body.title
        });

        savedPost.save()
        .then((data) => {
            res.status(201).send(data);
        })
        .catch((err) => {
            res.status(500).send('Error saving post to database ' + err);
        });

    })

    //EndPoints for gettask by ID
/*     app.get('/tasklists/:id', (req, res) => {
        
        TaskList.find({
            _id: req.params.id
        }).then((data) => { res.status(200).send(data) })
            .catch((err) => { res.status(404).send(err) });
    }); */

    app.get('/tasklists/:id', (req, res) => {
        TaskList.findById(req.params.id)
        .then((data) => { res.status(200).send(data) })
        .catch((err) => { res.status(404).send(err) });
    });

    //PUT is full update of object
    app.put('/tasklists/:id', (req, res) => {
        
        TaskList.findOneAndUpdate({_id: req.params.id}, { $set: req.body})
        .then((data) => { res.status(200).send(data) })
        .catch((err) => { res.status(404).send(err) });
    });
    //patch is partial update of one filed of an object
    app.put('/tasklists/:id', (req, res) => {
        
        TaskList.findOneAndUpdate({_id: req.params.id}, { $set: req.body})
        .then((data) => { res.status(200).send(data) })
        .catch((err) => { res.status(404).send(err) });
    });

    


    //Get All Task 
    // http:localhost:3000/tasklist => [{Task}, {Task}, {Task}]

    app.get('/task', (req, res)=> { 
        
        TaskList.find({})
            
            .then( (lists) => {res.send(lists)} )

            .catch((error) => console.log(error));
    } );


 


app.listen(3000, () => console.log('server started on port 3000'));
