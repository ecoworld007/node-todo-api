require('./config/configs');

const _ = require('lodash');
const express = require('express');
const bodyParser =  require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

let PORT =  process.env.PORT || 3000;

let app = express();

app.use(bodyParser.json());

app.post('/users',(req, res) => {
    let newUser = new User(_.pick(req.body, ['email', 'password']));
    newUser.generateAuthToken().then(token => {
        res.header('x-auth',token).send(newUser);
    }).catch(err => {
        console.log('Unable to save User ' + err);
        res.status(400).send(err);
    })
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then(token => {
            res.header('x-auth',token).send(user);
        });
    }).catch(err => res.status(400).send());
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => res.send()).catch(err => res.status(401).send());
});

app.post('/todos', authenticate, (req, res) => {
    let newTodo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt,
        _creator: req.user._id
    });
    newTodo.save().then((doc) => {
        res.send(doc);
    }).catch(err => res.status(400).send(err));
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({_creator: req.user._id}).then((todos) => {
        res.send({todos});
    }).catch(err => res.status(400).send(err));
});

app.get('/todos/:id', authenticate, (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(404).send();
    }
    Todo.findOne({_id: req.params.id, _creator: req.user._id}).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }, (err) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(404).send();
    }
    Todo.findOneAndRemove({_id: req.params.id, _creator: req.user._id}).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }, (err) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
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
    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body},{new: true}).then((todo) => {
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