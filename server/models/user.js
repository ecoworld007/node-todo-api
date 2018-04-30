const mongoose =  require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
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
            },
            token: {
                type: String,
                require: true
            }
        }
    ]
});

UserSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    return _.pick(userObject,['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function(){
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access},'123abc').toString();
    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function(token){
    let user = this;
    return user.update({ 
        $pull: {
            tokens: {token}
        }
    });
};

UserSchema.statics.findByToken = function(token){
    let User = this;
    let decoded;
    try{
        decoded = jwt.verify(token, '123abc');
    }catch(err){
        return Promise.reject();
    }
    return User.findOne({'_id': decoded._id, 'tokens.token': token, 'tokens.access': 'auth'});
};

UserSchema.statics.findByCredentials = function(email, password){
    let User = this;
    return User.findOne({email}).then(user => {
        if(!user){
            return Promise.reject();
        }
        return bcrypt.compare(password, user.password).then(res => {
            if(res){
                return Promise.resolve(user);
            }
            return Promise.reject();
        })
    }).catch(err => Promise.reject());
};

UserSchema.pre('save', function(next){
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            if(err){
                return next();
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err){
                    return next();
                }
                user.password=hash;
                next();
            });
        });
    }else{
        next()
    }
});

let User = mongoose.model('User', UserSchema);

module.exports = {
    User
};