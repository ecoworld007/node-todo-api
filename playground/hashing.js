const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = 'secret123';

bcrypt.genSalt(10, (err, salt) => {
    console.log(salt);
    bcrypt.hash(password, salt, (err, res) => {
        console.log(res)
    });
})

let hash = '$2a$10$0KmQKkeWPXTKm.e1HolxFuS6NUqEX8aBKUwc1QFnoXC.FR5aFWVRq';

bcrypt.compare(password, hash).then(res => console.log(res));

let data = {
    id: 10
};

let token = jwt.sign(data, '123abc');
console.log(token);

let decoded = jwt.verify(token,'123abc');
console.log('decode: '+JSON.stringify(decoded));
// let message = 'wooo hooo avengers are dead';
// let hash = SHA256(message).toString();

// console.log('message: '+message);
// console.log('hashed: '+ hash);

// let data = {
//     id: 4
// };

// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data)+'somesecret').toString()
// }

// token.data.id=5;
// token.hash = SHA256(JSON.stringify(token.data)+'somesecret').toString();

// let resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();

// if(resultHash === token.hash){
//     console.log('nobody messed with the message. So its probably safe');
// }else{
//     console.log('somebody seems to be interested in you because your message is being tempered with');
// }