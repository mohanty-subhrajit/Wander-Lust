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
    },
    
    // Profile fields
    mobileNumber:{
        type:String,
        default:null
    },
    profilePhoto:{
        filename:{
            type:String,
            default:null
        },
        url:{
            type:String,
            default:null
        }
    },
    bio:{
        type:String,
        default:null
    },
    address:{
        type:String,
        default:null
    },
    
    // UPI ID for receiving payments
    upiId:{
        type:String,
        default:null
    }
    
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);