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

test("Should not create task with invalid description/completed",async()=>{
    await request(app)
            .post("/tasks")
            .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
            .send({
                description : '',
                completed : 2
            }).expect(400)
})

//Read
test("Should read task for users" ,async()=>{
    const response = await request(app)
                          .get("/tasks")
                          .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                          .send()
                          .expect(200)
    // console.log(response.body);
    expect(response.body).toHaveLength(2)
})

test("Should fetch user task by id",async()=>{
    const  response = await request(app)
                            .get(`/tasks/${task1._id}`)
                            .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                            .send({})
                            .expect(200)
    const task = await Task.findById(response.body._id);

    expect(task.owner).toEqual(userOneId)
})

test("Should not fetch user task by id if unauthenticate",async()=>{
        await request(app)
            .get(`/tasks/${task1._id}`)
            .send({})
            .expect(401)
})

test("Should not fetch other users task by id",async()=>{
    await request(app)
        .get(`/tasks/${task3._id}`)
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({})
        .expect(404)
})

test("Should fetch only completed tasks",async()=>{
    const response = await request(app)
        .get(`/tasks?completed=true`)
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({})
        .expect(200)
    expect(response.body).not.toBeNull()

})

test("Should fetch only incompleted tasks",async()=>{
    const response = await request(app)
        .get(`/tasks?completed=false`)
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({})
        .expect(200)
    expect(response.body).not.toBeNull()

})



//Update
test("Should not update task with invalid description/completed", async()=>{
    await request(app)
            .patch(`/tasks/${task1._id}`)
            .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
            .send({
                description : '',
                completed : 2
            })
            .expect(400)

})

test("Should not update other users task", async()=>{
    await request(app)
            .patch(`/tasks/${task3._id}`)
            .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
            .send({
                description : '',
                completed : 2
            })
            .expect(404)
})




//Delete

test("Should not permit delete for unknown task",async ()=>{
    const response = await request(app)
                    .delete(`/tasks/${task1._id}`)
                    .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
                    .send()
                    .expect(404);
    const task = await Task.findById(task1._id)
    expect(task).not.toBeNull();
})


test("Should delete user task",async ()=>{
              await request(app)
                    .delete(`/tasks/${task1._id}`)
                    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
                    .send()
                    .expect(200);
    const task = await Task.findById(task1._id)
    expect(task).toBeNull();
})


test("Should not delete task if unauthenticated",async ()=>{
    await request(app)
          .delete(`/tasks/${task1._id}`)
          .send()
          .expect(401);
   const task = await Task.findById(task1._id)
   expect(task).not.toBeNull();
})
