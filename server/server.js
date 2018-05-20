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

app.post('/users', async (req, res) => {
    try{
        const newUser = new User(_.pick(req.body, ['email', 'password']));
        const token = await newUser.generateAuthToken();
        res.header('x-auth',token).send(newUser);
    }catch(err){
        console.log('Unable to save User ' + err);
        res.status(400).send(err);
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', async (req, res) => {
    try{
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth',token).send(user);
    }catch(err){
        res.status(400).send();
    }
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => res.send()).catch(err => res.status(401).send());
});

app.post('/todos', authenticate, async (req, res) => {
    try{
        const newTodo = new Todo({
            text: req.body.text,
            completed: req.body.completed,
            completedAt: req.body.completedAt,
            _creator: req.user._id
        });
        const doc = await newTodo.save();
        res.send(doc);
    }catch(err){
        res.status(400).send(err);
    }
});

app.get('/todos', authenticate, async (req, res) => {
    try{
        const todos = await Todo.find({_creator: req.user._id});
        res.send({todos});
    }catch(err){
        res.status(400).send(err)
    }
});

app.get('/todos/:id', authenticate, async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(404).send();
    }
    let todo;
    try{
        todo = await Todo.findOne({_id: req.params.id, _creator: req.user._id});
    }catch(err){
        return res.status(400).send();
    }
    if(!todo){
        return res.status(404).send();
    }
    res.send({todo});
});

app.delete('/todos/:id', authenticate, async (req, res) => {
    if(!ObjectID.isValid(req.params.id)){
        return res.status(404).send();
    }
    let todo;
    try{
        todo = await Todo.findOneAndRemove({_id: req.params.id, _creator: req.user._id});
    }catch(err){
        return res.status(400).send();
    }
    if(!todo){
        return res.status(404).send();
    }
    res.send({todo});
});

app.patch('/todos/:id', authenticate, async (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text','completed']);
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }
    let todo;
    try{
        todo = await Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body},{new: true});
    }catch(err){
        return res.status(400).send();
    }
    if(!todo){
        return res.status(404).send();
    }
    res.send({todo});
});

app.listen(PORT, () => {
    console.log('Server listening to the port '+PORT);
});

module.exports = {
    app
};