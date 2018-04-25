const {MongoClient, ObjectID} =  require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
    if(err){
        return console.log('Unable to Connect to Mongodb');
    }
    let todoAppDb = client.db('TodoApp');

    todoAppDb.collection('Todos').findOneAndUpdate({_id: ObjectID("5adeef3f59faf98170d5285f")},{ $set: {completed: true}},{returnOriginal: false}).then((res) => {
        console.log(JSON.stringify(res, undefined, 2));
    });

    todoAppDb.collection('Users').findOneAndUpdate({_id: ObjectID("5adef114c6b6ce7d2049725a")},{ $set: {name: 'Monkey D. Luffy'}, $inc: {age: 1}},{returnOriginal: false}).then((res) => {
        console.log(JSON.stringify(res, undefined, 2));
    });

    client.close();
});