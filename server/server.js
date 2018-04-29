require('./config/configs');

const _ = require('lodash');
const express = require('express');
const bodyParser =  require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

let PORT =  process.env.PORT || 3000;

let app = express();

app.use(bodyParser.json());

app.post('/todos',(req, res) => {
    let newTodo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt
    });
    newTodo.save().then((doc) => {
        console.log('Saved Todo '+ doc);
        res.send(doc);
    }, (err) => {
        console.log('Unable to save Todo '+err);
        res.status(400).send(err);
    });
});

app.post('/users',(req, res) => {
    let newUser = new User(_.pick(req.body, ['email', 'password']));
    newUser.generateAuthToken().then(token => {
        res.header('x-auth',token).send(newUser);
    }).catch(err => {
        console.log('Unable to save User ' + err);
        res.status(400).send(err);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(404).send();
    }
    Todo.findById(req.params.id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }, (err) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(req.params.id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }, (err) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id',(req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text','completed']);
    if(!ObjectID.isValid(req.params.id)){
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {$set: body},{new: true}).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    },(err)=> res.status(400).send());
});

app.listen(PORT, () => {
    console.log('Server listening to the port '+PORT);
});

module.exports = {
    app
};