const express = require('express');
const ioredis = require('ioredis');
const mongoose = require('mongoose')

const PORT = 3000
const app = express()
const redis = new ioredis();
const MONGOURI = "mongodb+srv://sage:sage@mcluster1.hpevtoo.mongodb.net/?retryWrites=true&w=majority&appName=mcluster1"
const User = require('./userModels/userModel')
app.use(express.json())
mongoose.connect(MONGOURI)
.then(()=>console.log("MongoDB connected"))
.catch((error)=>console.log("MongoDb connection error:",error))

app.get('/', (req,res)=> res.send("Hello from port 3000!"))
app.get('/getuser/:id', async (req,res)=>{
    try{
        let userId = req.params.id;
        userId = parseInt(userId)
        const cacheKey = `user:${userId}`
        const cachedUser = await redis.get(cacheKey)
        if(cachedUser){
            console.log("cache Hit!")
            return res.json(JSON.parse(cachedUser))
        }
        else{
            console.log("Cache Miss!")
            const user = await User.findOne({id:userId})
            if(!user){
                console.log("user not found in Mongo Db database!")
                return res.status(404).json({message:"User not found", userId:userId})
            }
            else{
                await redis.set(cacheKey, JSON.stringify(user), 'EX', 60)
                return res.status(200).json({user})
            }
        }
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error",error:error.message})
    }
})

app.post('/setuser/:id', async(req,res)=>{
    try{
        const userId= req.params.id;
        const {firstName, lastName, email, age, gender} = req.body;
        if(!firstName || !lastName || !email || !age || !gender){
            return res.status(400).json({message:"All fields are required"})
        }
        const user = await User.create({
            id:userId,
            firstName,
            lastName,
            email,
            age,
            gender
        })
        await user.save()
        await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 60)
        res.status(201).json({message:"User created successfully", user:user})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error", error:error})
    }
})
app.listen(PORT, ()=> console.log("Server running on port ",PORT))
