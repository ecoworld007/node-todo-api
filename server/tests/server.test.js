const {ObjectID} = require('mongodb');
const expect = require('expect');
const request =  require('supertest');

const {app} =  require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
    it('should add todo',(done) => {
        let text = 'test todo text';
        request(app).post('/todos').send({text}).expect(200).expect((res) => {
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
        request(app).post('/todos').send({text}).expect(400).end((err, res) => {
            if(err){
                return done(err);
            }
            Todo.find().then((docs) => {
                expect(docs.length).toBe(2);
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });

});

describe('GET /todos', () => {
    it('should fetch all the todos', (done) => {
        request(app).get('/todos').expect(200).expect((res) => {
            expect(res.body.todos).toBeAn('array');
            expect(res.body.todos.length).toBe(2);
        }).end((err, res) => {
            if(err){
                return done(err);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(res.body.todos.length);
                done();
            }).catch(err => done(err));
        })
    });
});

describe('GET /todos/:id', () => {
    it('should fetch the todo for valid id', (done) => {
        request(app).get(`/todos/${todos[0]._id.toHexString()}`).expect(200).expect((res) => {
            expect(res.body.todo).toBeAn('object').toIncludeKey('text');
        }).end((err, res) => {
            if(err){
                return done(err);
            }
            expect(res.body.todo.text).toBe(todos[0].text);
            done();
        });
    });

    it('should return a 404 if todo not found', (done) => {
        request(app).get(`/todos/${new ObjectID().toHexString()}`).expect(404).expect((res) => {
            expect(res.body).toBeAn('object');
        }).end(done);
    });

    it('should return a 404 for not valid object id', (done) => {
        request(app).get(`/todos/2q}`).expect(404).expect((res) => {
            expect(res.body).toBeAn('object');
        }).end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete the todo for valid id', (done) => {
        let id = todos[0]._id.toHexString();
        request(app).delete(`/todos/${id}`).expect(200).expect((res) => {
            expect(res.body.todo).toBeAn('object').toIncludeKey('text');
        }).end((err, res) => {
            if(err){
                return done(err);
            }
            expect(res.body.todo.text).toBe(todos[0].text);
            Todo.findById(id).then((todo) => {
                expect(todo).toNotExist();
                done();
            });
        });
    });

    it('should return a 404 if todo not found', (done) => {
        request(app).delete(`/todos/${new ObjectID().toHexString()}`).expect(404).expect((res) => {
            expect(res.body).toBeAn('object');
        }).end(done);
    });

    it('should return a 404 for not valid object id', (done) => {
        request(app).delete(`/todos/2q}`).expect(404).expect((res) => {
            expect(res.body).toBeAn('object');
        }).end(done);
    });
});

describe('PATCH /todos/:id', () => {

    it('should update todo', (done) => {
        let id = todos[0]._id.toHexString();
        let text = 'testing patch todo';
        request(app).patch(`/todos/${id}`).send({text, completed: true}).expect(200).expect((res) => {
            expect(res.body.todo).toBeAn('object').toIncludeKey('text');
        }).end((err, res) => {
            if(err){
                return done(err);
            }
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
            done();
        });
    });

    it('should clear completedAt if todo is not completed', (done) => {
        let id = todos[1]._id.toHexString();
        let text = 'test second patch';
        request(app).patch(`/todos/${id}`).send({text, completed: false}).expect(200).expect((res) => {
            expect(res.body.todo).toBeAn('object').toIncludeKey('text');
        }).end((err, res) => {
            if(err){
                return done(err);
            }
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
            done();
        });
    });
});