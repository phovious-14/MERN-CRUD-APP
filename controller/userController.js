// const bcrypt = require("bcryptjs")
const projectModel = require("../model/projectModel")
const userModel = require("../model/userModel")

exports.signup = async (req,res) => {

    try{

        const { name, email, city, password } = req.body

        if(!name || !email || !city || !password ){
            return res.status(400).json({messege:"fields are necessary"})  
        }

        const userExist = await userModel.findOne({email})

        if(userExist){
            return res.status(401).json({message:"user is exist"})
        }

        const user = new userModel({
            name,
            email,
            city,
            password,
        })

        await user.save()
        res.status(200).json({messege:"User added successfully!"})

    }catch(err){
        res.send(err)
    }
}

exports.login = async (req,res) => {
    try{

        const {email,password} = req.body

        if(!email || !password){
            return res.status(400).json({messege:"fields are necessary"})
        }

        const userExist = await userModel.findOne({email})

        if(userExist){                    
            
            if(password == userExist.password){                      
                
                const token = await userExist.genAuthToken()
                res.cookie("jwtoken",token,{
                    expires:new Date( Date.now() + 1 * 3600 * 1000 ),
                    httpOnly:true
                }).status(200).json({messege:"Token-cookie generated"}) 
            }
            else{
                return res.status(401).json({messege:"Invalid credentials"})
            }

        }else{
            res.status(401).json({messege:"Invalid credentials"})
        }

    }catch(err){
        res.send(err)
    }
}

exports.about = async (req,res) => {
    try{
        
        if(req.rootUserId){
            
            const id = req.rootUserId
            const data = await userModel.findOne({id})
            res.status(200).json({data})

        } else {
            res.status(401).json({messege:"User not found"})
        }
    } catch(err) {
        console.log(err);
    }
    
}

exports.logout = (req,res) => {
    try{
        res.clearCookie("jwtoken",{path:"/"})
        res.status(200).json({msg:"logout"})
    } catch(err) {
        console.log(err);
    }
}

exports.addProject = async (req, res) => {
    try {    

        const id = req.rootUserId;

        const { name, description, startDate, endDate, categories } = req.body

        if(!name || !description || !startDate || !endDate || !categories){
            return res.status(400).json({messege:"fields are necessary"})  
        }

        //check if student exist in student model or not
        const isUserExist = await userModel.findOne({ id });

            //if student doesn't exist than throw error
            if(!isUserExist) {
                return res.status(400).json({messege: "User does not exist"});
            }
        
        //find by enrollment number, than push activity in array,if no enrollment number found than create new object and push activity by {upsert:true}
        //if any error occur than handle it through last argument of findOneAndUpdate()
        projectModel.findOneAndUpdate({userId: id},{

            $push:{
                projects:{
                    name,
                    description,
                    startDate,
                    endDate,
                    categories
                }
            },
            userId:id

        }, { upsert:true },
        (err) => {
            if(err) {
                return res.status(401).json({messege: "Something went wrong"});
            }
            else{
                return res.status(200).json({messege: "Project added successfully"});
            }
        });        
        
    } catch (err) {
        console.log(err);
        res.status(401).json({messege:"error in uploading"})
    }
}

exports.getProject = async (req, res) => {
    try {

        const id = req.rootUserId;
        const data =  await projectModel.findOne({ userId: id });

        res.status(200).json({data})
        
    } catch (error) {
        console.log(error);
    }
}