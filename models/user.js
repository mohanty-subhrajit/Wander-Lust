const mongoose = require("mongoose");
const Schema  = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const  userSchema = new Schema({
    email:{
        type:String,
        required :true
    },

    googleId:{
        type:String,
        default:null
    },
    
    isAdmin:{
        type:Boolean,
        default:false
    }
    
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);