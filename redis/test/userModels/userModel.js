const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    id: { type: Number, unique: true ,required:true},
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    email: {type:String, required:true},
    gender: {type:String, required:true},
    age: {type:Number}
})
module.exports = mongoose.model('User',userSchema);