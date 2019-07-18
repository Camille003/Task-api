const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

//CREATING NEW USER AND GIVING OFF EVERYTHING BECAUSE WE DESTROY DATA BEFORE EVRY TEST 
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id : userOneId,
    name : 'Camille',
    email : 'camilleseke03@gmail.com',
    password : '123456789',
    tokens:[{
        token : jwt.sign({_id : userOneId},process.env.JWT_SECRET)
    }]
}


//CREATING SECOND USER AND GIVING OFF EVERYTHING BECAUSE WE DESTROY DATA BEFORE EVRY TEST 
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id : userTwoId,
    name : 'Camille',
    email : 'camilleseke04@gmail.com',
    password : '123456789',
    tokens:[{
        token : jwt.sign({_id : userTwoId},process.env.JWT_SECRET)
    }]
}



const task1 = {
    _id : new mongoose.Types.ObjectId(),
    description : 'First task',
    completed : false,
    owner : userOne._id

}

const task2 = {
    _id : new mongoose.Types.ObjectId(),
    description : 'Second task',
    completed : true,
    owner : userOne._id

}

const task3 = {
    _id : new mongoose.Types.ObjectId(),
    description : 'Third task',
    completed : true,
    owner : userTwo._id

}

const setUpDatabase = async () =>{
     await User.deleteMany();
     await Task.deleteMany();
     await new User(userOne).save()
     await new User(userTwo).save()
     await new Task(task1).save()
     await new Task(task2).save()
     await new Task(task3).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    task1,
    setUpDatabase
}