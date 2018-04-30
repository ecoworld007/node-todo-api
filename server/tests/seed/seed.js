const jwt = require('jsonwebtoken');
const {ObjectID} =  require('mongodb');

const {Todo} =  require('../../models/todo');
const {User} =  require('../../models/user');

let userOneId = new ObjectID();
let userSecondId = new ObjectID();

const users = [
    {
        _id: userOneId.toHexString(),
        email: 'userone@email.com',
        password: 'testuseronepassword',
        tokens:[
            {
                access: 'auth',
                token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'},'123abc')
            }
        ]
    },
    {
        _id: userSecondId.toHexString(),
        email: 'usersecond@email.com',
        password: 'testusersecondpassword'
    }
]

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

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userone = new User(users[0]).save();
        let usersecond = new User(users[1]).save();
        Promise.all([userone, usersecond]).then(() => done()).catch(err => done());
    }).catch(err => done());
}

module.exports = {
    populateUsers,
    users,
    populateTodos,
    todos
};