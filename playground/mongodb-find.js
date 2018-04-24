const {MongoClient, ObjectID} =  require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
    if(err){
        return console.log('Unable to Connect to Mongodb');
    }
    let todoAppDb = client.db('TodoApp');

    todoAppDb.collection('Todos').find({_id: new ObjectID('5adf060eb8ed9da499fbfa28')}).toArray().then((res) => {
        console.log('Todos: ');
        console.log(JSON.stringify(res, undefined, 2));
    }, (err) => {
        if(err){
            return console.log('Unable to fetch todos');
        }
    });

    todoAppDb.collection('Todos').find().count().then((count) => {
        console.log('Todos count: '+count);
    }, (err) => {
        if(err){
            return console.log('Unable to fetch todos');
        }   
    });

    todoAppDb.collection('Users').find({name: 'Zoro'}).count().then((count) => {
        console.log('Todos count: '+count);
    }, (err) => {
        if(err){
            return console.log('Unable to fetch todos');
        }   
    });

    client.close();
});