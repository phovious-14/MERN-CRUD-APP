const jwt = require("jsonwebtoken")
const userModel = require("../model/userModel")

const authenticate = async (req,res,next) => {
    try {
        console.log("kk");

        if(req.cookies.jwtoken) {
            res.clearCookie("adminjwtoken",{path:"/"})
        }
        if(req.cookies.adminjwtoken) {
            res.clearCookie("jwtoken",{path:"/"})
        }

        const token = req.cookies.jwtoken || req.cookies.adminjwtoken   // get token from cookie
        
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY) // verify token
    
        const rootUser = await userModel.findOne({_id:verifyToken._id, "tokens.token":token}) // find user with token
        
        if(!rootUser){ throw new Error("unauthorized user") } // if user not found

        req.token = token // add token to request
        req.rootUserId = rootUser.id // getting whole documetn of user

        next()
        

    } catch (error) {
        res.status(403).send("unauthorized token provided")
    }
}

module.exports = authenticate