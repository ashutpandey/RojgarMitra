import jwt from "jsonwebtoken"


export const sendcookies = (user,res,message,statusCode=201) =>{
    const token = jwt.sign({_id:user._id , name: user.name},process.env.JWT_SECRET)
    res.status(statusCode).cookie("token",token,{
        httpOnly:true,
        maxAge:24 * 60 * 60 * 1000,
    }).redirect("/")
}