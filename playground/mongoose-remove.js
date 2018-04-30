const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

Todo.remove({}).then((result) => {
    console.log(result);
});

Todo.findOneAndRemove({text: 'some todo'}).then((result) => {
    console.log(result);
});

Todo.findByIdAndRemove(new ObjectID('5ae1b4a6b574cd7f4cdb138c').toHexString()).then((todo) => {
    console.log(todo);
}).catch(err => console.log('Unable to delete todo with given id'));