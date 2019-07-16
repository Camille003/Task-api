const app = require("../src/app");
const request = require("supertest");


test("Should sign up user",async()=>{
    await request(app).post("/users").send({name : 'camille',email:'camillee03@gmail.com',password:'123456789'}).expect(201);
})