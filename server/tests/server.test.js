const expect = require('expect');
const request =  require('supertest');

const {app} =  require('../server');
const {Todo} = require('../models/todo');

beforeEach((done)=>{
    Todo.remove({}).then(() => {
        console.log('Successfuly removed.');
        done();
    })
})

describe('POST /todos', () => {
    it('should add todo',(done) => {
        let text = 'test todo text';
        request(app).post('/todos').send({text}).expect(200).expect((res) => {
            expect(res.body.text).toBe(text);
        }).end((err, res) => {
            if(err){
                return done(err);
            }
            Todo.find().then((docs) => {
                expect(docs.length).toBe(1);
                expect(docs[0].text).toBe(text);
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
                expect(docs.length).toBe(0);
                done();
            }).catch((err) => {
                done(err);
            });
        });
    });

});