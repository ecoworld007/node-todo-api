const {MongoClient, ObjectID} =  require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
    if(err){
        return console.log('Unable to Connect to Mongodb');
    }
    let todoAppDb = client.db('TodoApp');

    // todoAppDb.collection('Todos').deleteMany({text: 'eat lunch'}).then((res) => {
    //     console.log(res);
    // });

    // todoAppDb.collection('Todos').deleteOne({text: 'eat lunch'}).then((res) => {
    //     console.log(res);
    // });
   
    todoAppDb.collection('Todos').findOneAndDelete({completed: true}).then((res) => {
        console.log(res);
    });

    client.close();
});