const mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 var passportLocalMongoose = require('passport-local-mongoose')
 
 const User = new Schema({
     firstname: {
         type: String,
         default: ''
     },
     lastname: {
        type: String,
        default: ''
     },
     admin: {
         type: Boolean , 
         default: false
     }
 });

 User.plugin(passportLocalMongoose);  // Automatically  adds username and password

module.exports = mongoose.model('User' , User);