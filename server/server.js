const mongoose = require('./db/mongoose');

const Todo = require('./models/todo');
const User = require('./models/user');


let newTodo = new Todo({
    text: 'Cook dinner',
    completed: false
});

newTodo.save().then((doc) => {
    console.log('Saved Todo '+ doc)
}, (err) => {
    console.log('Unable to save Todo '+err);
});

let otherTodo = new Todo({
    text: '   Boooyaa Feed cat     ',
    completed: false,
    completedAt: 123
});

otherTodo.save().then((doc) => {
    console.log('Saved Todo '+ doc)
}, (err) => {
    console.log('Unable to save Todo '+err);
});





let newUser = new User({
    email: 'luffy@onepiece.com',
    password: 'iwillbethekingofpirates'
});

newUser.save().then( (doc) => {
    console.log('User is saved '+ doc);
}, (err) => {
    console.log('Unable to save User ' + err);
})