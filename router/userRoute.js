const express = require("express")
const route = express.Router()
const controller = require("../controller/userController")
const authenticate = require("../middleware/authenticate")

route.post("/api/signup", controller.signup)

route.post("/api/login", controller.login)

route.get("/api/about", authenticate, controller.about)

route.get("/api/logout", authenticate, controller.logout)

route.post("/api/addProject", authenticate, controller.addProject)

route.get("/api/getProject", authenticate, controller.getProject)
 
module.exports = route