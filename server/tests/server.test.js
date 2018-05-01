const {ObjectID} = require('mongodb');
const expect = require('expect');
const request =  require('supertest');
const jwt = require('jsonwebtoken');

const {app} =  require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
    it('should add todo',(done) => {
        let text = 'test todo text';
        request(app).post('/todos').set('x-auth',users[0].tokens[0].token).send({text}).expect(200).expect((res) => {
            expect(res.body.text).toBe(text);
        }).end((err, res) => {
            if(err){
                return done(err);
            }
            Todo.find({text}).then((docs) => {
                expect(docs.length).toBe(1);
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });

    it('should not create todo with invalid request body',(done) => {
        let text = '';
        request(app).post('/todos').set('x-auth',users[0].tokens[0].token).send({text}).expect(400).end((err, res) => {
            if(err){
                return done(err);
            }
            Todo.find({_creator: users[0]._id}).then((docs) => {
                expect(docs.length).toBe(1);
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });

});

describe('GET /todos', () => {
    it('should fetch all the todos', (done) => {
        request(app).get('/todos').set('x-auth', users[0].tokens[0].token).expect(200).expect((res) => {
            expect(res.body.todos.length).toBe(1);
        }).end((err, res) => {
            if(err){
                return done(err);
            }
            Todo.find({_creator: users[0]._id}).then((todos) => {
                expect(todos.length).toBe(res.body.todos.length);
                done();
            }).catch(err => done(err));
        })
    });
});

describe('GET /todos/:id', () => {
    it('should fetch the todo for valid id', (done) => {
        request(app).get(`/todos/${todos[0]._id.toHexString()}`).set('x-auth', users[0].tokens[0].token).expect(200).expect((res) => {
            expect(typeof res.body.todo).toBe('object');
            expect(res.body.todo).toHaveProperty('text');
        }).end((err, res) => {
            if(err){
                return done(err);
            }
            expect(res.body.todo.text).toBe(todos[0].text);
            done();
        });
    });

    it('should not fetch todo of other user', (done) => {
        request(app).get(`/todos/${todos[0]._id.toHexString()}`).set('x-auth', users[1].tokens[0].token).expect(404).expect((res) => {
            expect(typeof res.body).toBe('object');
        }).end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        request(app).get(`/todos/${new ObjectID().toHexString()}`).set('x-auth', users[0].tokens[0].token).expect(404).expect((res) => {
            expect(typeof res.body).toBe('object');
        }).end(done);
    });

    it('should return a 404 for not valid object id', (done) => {
        request(app).get(`/todos/2q}`).set('x-auth', users[0].tokens[0].token).expect(404).expect((res) => {
            expect(typeof res.body).toBe('object');
        }).end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete the todo for valid id', (done) => {
        let id = todos[0]._id.toHexString();
        request(app).delete(`/todos/${id}`).set('x-auth', users[0].tokens[0].token).expect(200).expect((res) => {
            expect(typeof res.body.todo).toBe('object');
            expect(res.body.todo).toHaveProperty('text');
        }).end((err, res) => {
            if(err){
                return done(err);
            }
            expect(res.body.todo.text).toBe(todos[0].text);
            Todo.findById(id).then((todo) => {
                expect(todo).toBeFalsy();
                done();
            });
        });
    });

    it('should not delete the todo of other users', (done) => {
        let id = todos[0]._id.toHexString();
        request(app).delete(`/todos/${id}`).set('x-auth', users[1].tokens[0].token).expect(404).end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        request(app).delete(`/todos/${new ObjectID().toHexString()}`).set('x-auth', users[0].tokens[0].token).expect(404).expect((res) => {
            expect(typeof res.body).toBe('object');
        }).end(done);
    });

    it('should return a 404 for not valid object id', (done) => {
        request(app).delete(`/todos/2q}`).set('x-auth', users[0].tokens[0].token).expect(404).expect((res) => {
            expect(typeof res.body).toBe('object');
        }).end(done);
    });
});

describe('PATCH /todos/:id', () => {

    it('should update todo', (done) => {
        let id = todos[0]._id.toHexString();
        let text = 'testing patch todo';
        request(app).patch(`/todos/${id}`).set('x-auth', users[0].tokens[0].token).send({text, completed: true}).expect(200).expect((res) => {
            expect(typeof res.body.todo).toBe('object');
            expect(res.body.todo).toHaveProperty('text');
        }).end((err, res) => {
            if(err){
                return done(err);
            }
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completedAt).toBe('number');
            done();
        });
    });

    it('should not update todo of other users', (done) => {
        let id = todos[0]._id.toHexString();
        let text = 'testing patch todo';
        request(app).patch(`/todos/${id}`).set('x-auth', users[1].tokens[0].token).send({text, completed: true}).expect(404).end(done);
    });

    it('should clear completedAt if todo is not completed', (done) => {
        let id = todos[1]._id.toHexString();
        let text = 'test second patch';
        request(app).patch(`/todos/${id}`).set('x-auth', users[1].tokens[0].token).send({text, completed: false}).expect(200).expect((res) => {
            expect(typeof res.body.todo).toBe('object')
            expect(res.body.todo).toHaveProperty('text');
        }).end((err, res) => {
            if(err){
                return done(err);
            }
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBeFalsy();
            done();
        });
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app).get('/users/me').set('x-auth', users[0].tokens[0].token).expect(200).expect(res => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(typeof res.body.email).toBe('string');
        }).end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app).get('/users/me').expect(401).expect(res => {
            expect(res.body).toEqual({});
        }).end(done);
    });
});

describe('POST /users', () => {
    it('should create user', (done) => {
        let newUser = {
            email: 'test@email.com',
            password: 'secret'
        }
        request(app).post('/users').send(newUser).expect(200).expect(res => {
            User.findById(res.body._id).then(user => {
                expect(user.email).toBe(newUser.email);
                expect(user.password).not.toBe(newUser.password);
            }).catch(err => done(err));
        }).end(done);
    });

    it('should return validation error if request is invalid', (done) => {
        let newUser = {
            email: 'test@emailcom',
            password: 'secret'
        }
        request(app).post('/users').send(newUser).expect(400).end(done);
    });

    it('should not create user if email already used', (done) => {
        request(app).post('/users').send(users[0]).expect(400).end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return token', (done) => {
        request(app).post('/users/login').send(users[0]).expect(200).expect(res => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body.email).toBe(users[0].email);
            expect(res.body._id).toBe(users[0]._id.toHexString());
        }).end((err, res) => {
            if(err){
                return done(err);
            }
            User.findById(res.body._id).then(user => {
                expect(user).toBeTruthy();
                expect(user.tokens[1]).toMatchObject({
                    'access': 'auth',
                    'token': res.headers['x-auth']
                });
                done();
            }).catch(err => done(err));
        });
    });

    it('should not login invalid user', (done) => {
        request(app).post('/users/login').send({email: users[1].email, password: users[1].password+'1'}).expect(400).expect(res => {
            expect(res.headers['x-auth']).toBeFalsy();
        }).end((err, res) => {
            if(err){
                return done(err);
            }
            User.findOne({email: users[1].email}).then(user => {
                expect(user).toBeTruthy();
                expect(user.tokens.length).toBe(0);
                done();
            }).catch(err => done());
        });
    });
});

describe('DELETE /users/me/token', () => {
    it('should delete token for the user', (done) => {
        request(app).delete('/users/me/token').set('x-auth', users[0].tokens[0].token).expect(200).end((err, res) => {
            if(err){
                return done();
            }
            User.findById(users[0]._id).then(user => {
                expect(user).toBeTruthy();
                expect(user.tokens.length).toBe(0);
                done();
            }).catch(err => done(err));
        });
    });
});