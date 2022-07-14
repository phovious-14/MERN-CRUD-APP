const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const schema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    city:{
        type:String,
        require:true
    },
    tokens:[
        {
            token:{
                type:String,
                require:true
            },
            date:{
                type:Date,
                default:Date.now
            }
        }
    ]
})

// schema.pre("save",async function(next){
//     if(this.isModified('password')){
//         this.password = await bcrypt.hash(this.password,12)
//     }
//     next()
// })

schema.methods.genAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this._id},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save()
        return token

    }catch(err){
        console.log(err)
    }
}

const userModel = mongoose.model("userData", schema)

module.exports = userModel