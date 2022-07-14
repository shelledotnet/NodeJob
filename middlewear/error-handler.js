const {CustomAPIError}=require('../errors')
const {v4:uuid}=require('uuid');
const {StatusCodes}=require('http-status-codes')
const errorHandlerMiddlewear=(err,req,res,next)=>{
    console.log(err);
    if(err instanceof CustomAPIError){
        
       return res.status(err.statusCode).json({data:err.message,code:err.statusCode,success:false,ref:uuid()})
       
    }
    if(err.name && err.name==='ValidationError'){
        return res.status(StatusCodes.BAD_REQUEST).json({data:Object.values(err.errors).map((item)=>item.message).join(','),code:StatusCodes.BAD_REQUEST,success:false,ref:uuid()})

    }
    if(err.name && err.name==='CastError'){
        return res.status(StatusCodes.NOT_FOUND).json({data:`no item found with id ${err.value}`,code:StatusCodes.NOT_FOUND,success:false,ref:uuid()})

    }
    if(err.code && err.code===11000){
        return res.status(StatusCodes.CONFLICT).json({data:`duplicate value for ${Object.keys(err.keyValue)}`,code:StatusCodes.CONFLICT,success:false,ref:uuid()})

    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({data:err,code:StatusCodes.INTERNAL_SERVER_ERROR,success:false,ref:uuid()});
   //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({data:'something went wrong please try again later!',code:StatusCodes.INTERNAL_SERVER_ERROR,success:false,ref:uuid()});

}
module.exports=errorHandlerMiddlewear;