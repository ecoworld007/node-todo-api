const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');

let Todo = mongoose.model('Todo',{
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

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
    text: 'Feed cat',
    completed: false,
    completedAt: 123
});

otherTodo.save().then((doc) => {
    console.log('Saved Todo '+ doc)
}, (err) => {
    console.log('Unable to save Todo '+err);
});