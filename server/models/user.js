const mongoose =  require('mongoose');

let User = mongoose.model('User',{
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true //remove the trailing spaces from the terminals
    },
    password: {
        type: String,
        default: true
    }
});

module.exports = {
    User
};