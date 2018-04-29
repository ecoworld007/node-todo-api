const mongoose =  require('mongoose');
const validator = require('validator');

let User = mongoose.model('User',{
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true, //remove the trailing spaces from the terminals
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not the valid email'
        }
    },
    password: {
        type: String,
        require: true
    },
    tokens: [
        {
            access: {
                type: String,
                require: true
            }
        }
    ]
});

module.exports = {
    User
};