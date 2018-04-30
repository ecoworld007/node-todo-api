const {ObjectID} =  require('mongodb');
const {Todo} =  require('../../models/todo');
const todos =[
    {
        _id: new ObjectID(),
        text: 'first test todo'
    },
    {
        _id: new ObjectID(),
        text: 'second test todo'
    }
];

const populateTodos = (done)=>{
    Todo.remove({}).then(() => {
        console.log('Successfuly removed.');
        Todo.insertMany(todos);
    }).then(()=>done());
};

module.exports = {
    populateTodos,
    todos
};