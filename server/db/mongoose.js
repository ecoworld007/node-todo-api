const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp').then((success) => {
    console.log('Connected to mongodb server');
},(err) => {
    console.log('Failed to connect to mongodb server'+ err);
});

module.exports = {
    mongoose
};