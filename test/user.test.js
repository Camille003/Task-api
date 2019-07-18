jest.setTimeout(10000);
const app = require("../src/app");
const request = require("supertest");
const User = require("../src/models/user")

const {userOne,userOneId,setUpDatabase} = require("./fixtures/db")


beforeEach(setUpDatabase)

test("Should sign up user",async()=>{
    const response = await request(app).post("/users").send({name : 'camille',email:'camille03@gmail.com',password:'123456789'}).expect(201);

    //assert that db was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    
    //respoonse body
   expect(response.body.user.name).toBe('camille');
   expect(response.body).toMatchObject({
       user:{
           name : 'camille',
           email :'camille03@gmail.com'
       }
   })
   
}) 

test("Should login user",async()=>{
    const response = await request(app).post("/users/login").send({
        email : userOne.email,
        password : userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id);

    const newToken = user.tokens[1].token;

    expect(newToken).toBe(response.body.token)
})

test("Should not login the user",async()=>{
    await request(app).post("/users/login").send({
        email : 'camille20@gmail.com',
        password : '123456789'
    }).expect(400);
})

test("Should fetch profile of user" ,async ()=>{
    await request(app)
          .get("/users/me")
          .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200)
})

test("Should not get Profile for unauthenticated User",async()=>{
    await request(app)
          .get("/users/me")
          .send()
          .expect(401)
})

test("Should delete account for user",async()=>{
   const response =  await request(app)
         .delete("/users/me")
         .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
         .send()
         .expect(200)
    const user = await User.findById(userOneId);

    expect(user).toBeNull()
})

test('Should not delete account for unauthorized user',async ()=>{
    await request(app)
            .delete("/users/me")
            .send()
            .expect(401)
})

test("Should upload avatar image",async()=>{
    await request(app)
          .post("/users/me/avatar")
          .set("Authorization",`Bearer ${userOne.tokens[0].token}`)
          .attach('avatar','test/fixtures/profile-pic.jpg')
          .expect(200);

    const user = await User.findById(userOneId);

    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update appropriate user fields if user is auhenticated",async ()=>{

   const response = await request(app)
          .patch("/users/me")
          .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
          .send({name : 'Camilla'})
          .expect(200)
        //   console.log(response.body);
    const user = await User.findById(userOneId);

    expect(response.body.name).toBe(user.name)

})

test("Should not update any field if inappropriate fields are set",async()=>{
    await request(app)
            .patch('/users/me')
            .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
            .send({figures : 'Cool'})
            .expect(400)
})