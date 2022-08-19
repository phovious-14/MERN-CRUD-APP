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

        const { email, password } = req.body

        if(!email || !password){
            return res.status(400).json({messege:"fields are necessary"})
        }
        
        const userExist = await userModel.findOne({email, password}) 
        // console.log(req.body);

        if(userExist){                                
                
            if(userExist.email === 'admin@gmail.com' && userExist.password === "admin123"){
                const adminToken = await userExist.genAuthToken()
                res.status(200).json({adminToken}) 
            } else {
                const token = await userExist.genAuthToken()
                res.status(200).json({token}) 
            }            

        } else {
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
            // console.log(id);
            const data = await userModel.findOne({_id:id})
            // console.log(data._id);
            // console.log(data);
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
        // console.log("logout successfully!");
    } catch(err) {
        console.log(err);
    }
}

exports.addProject = async (req, res) => {
    try {    

        const id = req.rootUserId;

        const { title, desc, startD, endD, choice } = req.body

        if(!title || !desc || !startD || !endD || !choice){
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
        const project = new projectModel({
            name: title,
            description: desc,
            startDate: startD,
            endDate: endD,
            categories: choice,
            userId:id
        })
        // console.log(project);
        await project.save()
        res.status(200).json({messege:"Project added successfully!"})  
        
    } catch (err) {
        console.log(err);
        res.status(401).json({messege:"error in uploading"})
    }
}

exports.getProject = async (req, res) => {
    try {

        const id = req.rootUserId;
        const data =  await projectModel.find({ userId: id });
        // console.log(data);
        res.status(200).json({data})
        
    } catch (error) {
        console.log(error);
    }
}

exports.token = async (req, res) => {
    console.log(req.cookies.jwtoken);
    res.json({ token: req.cookies.jwtoken })
}