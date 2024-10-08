class ErrorHandler extends Error{


    constructor(message,statuscode){

        super(message);
        this.statuscode=statuscode
    }
}

export const errorMiddleware = ((err,req,res,next)=>{
    console.log(err)
    err.message = err.message || "Internal Server Error"
    err.statuscode = err.statuscode || 500;
    return (
        res.status(err.statuscode).redirect(`/login?error=${err.message}`)
    )
})

export default ErrorHandler