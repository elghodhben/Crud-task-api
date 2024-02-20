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
        
        .then( (lists) => {res.send(lists)} )

        .catch((error) => console.log(error));
 } );


 //Get All Task 
// http:localhost:3000/tasklist => [{Task}, {Task}, {Task}]

app.get('/task', (req, res)=> { 
    
    TaskList.find({})
        
        .then( (lists) => {res.send(lists)} )

        .catch((error) => console.log(error));
 } );
 


app.listen(3000, () => console.log('server started on port 3000'));
