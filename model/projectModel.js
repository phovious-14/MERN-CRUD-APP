const mongoose = require("mongoose")
require("dotenv").config()

const schema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    startDate:{
        type:Date,
        require:true
    },
    endDate:{
        type:Date,
        require:true
    },
    categories:{
        type:Array,
        require:true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    }
})

const projectModel = mongoose.model("projectData", schema)

module.exports = projectModel