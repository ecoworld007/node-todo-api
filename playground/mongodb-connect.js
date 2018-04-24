const {MongoClient, ObjectID} =  require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to mongodb server');
    let todoAppDb = client.db('TodoApp');
    todoAppDb.collection('Todos').insertOne({
        text: 'something to do',
        completed: false
    }, (err, res) => {
        if(err){
            return console.log('Unable to insert the todo');
        }
        console.log(JSON.stringify(res.ops, undefined, 2));
    });

    todoAppDb.collection('Users').insertOne({
        name: 'Zoro',
        age: '20',
        location: 'East Blue'
    }, (err, res) => {
        if(err){
            return console.log('Unable to insert the user');
        }
        console.log(JSON.stringify(res.ops[0]._id.getTimestamp(), undefined, 2));
    });

    client.close();
});