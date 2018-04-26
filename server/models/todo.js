const mongoose =  require('mongoose');

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

module.exports = {
    Todo
};