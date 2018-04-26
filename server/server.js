const mongoose = require('./db/mongoose');

let Todo = mongoose.model('Todo',{
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true //remove the trailing spaces from the terminals
    },
    completed: {
        type: Boolean,
        default: true
    },
    completedAt: {
        type: Number,
        default: null
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
    text: '   Boooyaa Feed cat     ',
    completed: false,
    completedAt: 123
});

otherTodo.save().then((doc) => {
    console.log('Saved Todo '+ doc)
}, (err) => {
    console.log('Unable to save Todo '+err);
});



let User = mongoose.model('User',{
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true //remove the trailing spaces from the terminals
    },
    password: {
        type: String,
        default: true
    }
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