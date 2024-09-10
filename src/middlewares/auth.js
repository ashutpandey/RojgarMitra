import User from "../models/users.js"
import jwt from "jsonwebtoken"

export const isAuthenticated = async(req,res,next)=>{
    const {token} = req.cookies

    if(!token){
        return res.status(404).redirect("/loginerr")
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById({_id:decoded._id})
    next()
}