const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');


let id = '5ae1a93804ca39aaf486b5b2';

if(!ObjectID.isValid(id)){
    console.log('Id not valid');
}

Todo.find({
    _id : id
}).then((todos) => {
    console.log(todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    if(!todo){
        return console.log('id not found');
    }
    console.log(todo);
});

Todo.findById(id).then((todo) => {
    if(!todo){
        return console.log('id not found');
    }
    console.log(todo);
}).catch(err => console.log(err));

let userid = '5ae067e577b6b1a0344986f5';

User.findById(userid).then((user) => {
    if(!user){
        return console.log('id not found for user');
    }
    console.log(JSON.stringify(user, undefined, 2));
}).catch(err => console.log(err));