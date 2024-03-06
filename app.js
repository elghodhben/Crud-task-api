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

app.get('/tasklists', (req, res) => {

    TaskList.find({})

        .then((lists) => { res.status(200).send(lists) })

        .catch((error) => console.log(error));
});

//EndPoints for createing a TaskList
app.post('/tasklists', (req, res) => {
    //console.log('hello i am inside post methode');

    const savedPost = new TaskList({
        "title": req.body.title
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

    TaskList.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
        .then((data) => { res.status(200).send(data) })
        .catch((err) => { res.status(404).send(err) });
});
//patch is partial update of one filed of an object
app.patch('/tasklists/:id', (req, res) => {

    TaskList.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
        .then((data) => { res.status(200).send(data) })
        .catch((err) => { res.status(404).send(err) });
});

//EndPoints Delete a tasklists by id 
app.delete('/tasklists/:id', (req, res) => {
    
    //Delete all tasks withing a tasklist if that tasklist is deleted
    const deleteAllContainingTask = (tasklist) => {
        Task.deleteMany({_tasklistId: req.params.id})
        .then(()=> {return tasklist})
        .catch((err) => { console.log(err)});
    };
    const responseTaskList = TaskList.findByIdAndDelete(req.params.id)
        .then((data) => { deleteAllContainingTask(data) })
        .catch((err) => { res.status(404).send(err) });
        res.status(200).send(responseTaskList);
})





/** CRUD operation for Task, a task should always belong to a Tasklist  */

//Get All Task 
// http://localhost:3000/tasklists/id/tasks => [{Task}, {Task}, {Task}]
app.get('/tasklists/:tasklistsID/tasks', (req, res) => {

    Task.find({ _tasklistId: req.params.tasklistsID })
        .then((lists) => {
            if (!lists) {
                return res.status(404).send("No tasks found for this task list");
            }
            res.status(200).send(lists);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send("Internal Server Error");
        });
});

//Create a task inside a particular task list

app.post('/tasklists/:id/tasks', (req, res) => {
    console.log(req.body);
    let taskObj = {
        'title': req.body.title,
        '_tasklistId': req.params.id
    };
    Task(taskObj).save()
        .then((taskobj) => {
            res.status(201).send(taskobj);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

// http://localhost:3000/tasklists/id/tasks/:taskId
// Get 1 task inside 1 tasklist

app.get('/tasklists/:id/tasks/:taskId', (req, res) => {
    Task.findOne({
        _tasklistId: req.params.id,
        _id: req.params.taskId
    })
        .then((task) => {
            if (!task) {
                return res.status(404).send("Task not found");
            }
            res.status(200).send(task);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

//Update 1 task belonging to 1 Tasklist
app.patch('/tasklists/:id/tasks/:taskId', (req, res) => {
    Task.findOneAndUpdate({_tasklistId: req.params.id, _id: req.params.taskId}, { $set:req.body })
    .then((tasklist) => {
        res.status(200).send(tasklist);
    })
    .catch((error) => {
        res.status(500).send(error);
    });
});

//Delete 1 task belonging to 1 TaskList
app.delete('/tasklists/:id/tasks/:taskId', (req, res) =>{
    Task.findOneAndDelete({_tasklistId: req.params.id, _id: req.params.taskId})
    .then((task) => {
        res.status(200).send(task);
    })
    .catch((err) => {
        res.status(500).send(err);
    });
});


app.listen(3000, () => console.log('server started on port 3000'));
