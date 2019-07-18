jest.setTimeout(10000);
const app = require("../src/app");
const request = require("supertest")
const Task = require("../src/models/task");

const {
    userOne,
    userOneId,
    userTwo,
    task1,
    task2,
    task3,
    userTwoId,
    setUpDatabase} = require("./fixtures/db")

beforeEach(setUpDatabase)

test("Should create task for users", async ()=>{
    const response = await request(app)
                            .post('/tasks')
                            .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                            .send({
                                description : 'From my test'
                            })
                            .expect(201);
   const task = await Task.findById(response.body._id);
   expect(task).not.toBeNull();
    
})

test("Should read task for users" ,async()=>{
    const response = await request(app)
                          .get("/tasks")
                          .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                          .send()
                          .expect(200)
    // console.log(response.body);
    expect(response.body).toHaveLength(2)
})

test("Should not permit delete for unknown task",async ()=>{
    const response = await request(app)
                    .delete(`/task/${task1._id}`)
                    .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
                    .send({})
                    .expect(404);
    const task = await Task.findById(task1._id)
    expect(task).not.toBeNull();
})
