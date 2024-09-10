import User from "../models/users.js"
import bcrypt from "bcrypt"
import { sendcookies } from "../utils/features.js"
import ErrorHandler from "../middlewares/error.js"
import { isAuthenticated } from "../middlewares/auth.js"

const createUser = async (req, res,next) => {
    try {
        const { name, email, password } = req.body
        let user = await User.findOne({ email },{ maxTimeMS: 20000 })
        if (user) {
            return next(new ErrorHandler("User already exist", 400))
        }
        const hashedpassword=await bcrypt.hash(password,10);
        user = await User.create({name,email,password:hashedpassword})
        sendcookies(user,res,"Register Successfully",201);
    } catch (error) {
        next(error);
    }
}

const loginUser = async (req, res,next) => {
    try {
        const { email, password } = req.body
        let user = await User.findOne({ email })
        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 400))
        }
        const ismatched=await bcrypt.compare(password,user.password);
        if(!ismatched){
            return next(new ErrorHandler("Invalid email or password", 400))
        }
        sendcookies(user,res,"Login Successfully",200);
    } catch (error) {
        next (error);
    }
}

const logoutUser = (req,res) => {
        res.status(200).cookie("token", "", { expires: new Date(Date.now())})
        res.redirect("/")
}

export {createUser , loginUser , logoutUser}