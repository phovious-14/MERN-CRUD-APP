const mongoose = require("mongoose")
require("dotenv").config()

const schema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    city:{
        type: String
    },
    class:{
        sofa:{
            seats:{
                type: Number
            },
            price:{
                type:Number
            }
        },
        silver:{
            seats:{
                type: Number
            },
            price:{
                type:Number
            }
        },        
        golden:{
            seats:{
                type: Number
            },
            price:{
                type:Number
            }
        },
        platinum:{
            seats:{
                type: Number
            },
            price:{
                type:Number
            }
        }
    }
})

const projectModel = mongoose.model("projectData", schema)

module.exports = projectModel