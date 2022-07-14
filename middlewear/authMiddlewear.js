const {v4:uuid}=require('uuid');
const JobUser=require('../model/UserModel');
const jwt=require('jsonwebtoken');
const {ForBiddenError}=require('../errors');

const authenticaionMiddleware=async (req,res,next)=>{
   
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
      throw new ForBiddenError('access denied')
    }
    console.log(req.headers.authorization);
     const token=authHeader.split(' ')[1];
     try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const {userId,username}=decoded;
        //attached the user to the jobRoute
 
        req.user={userId,username}
        next()//this trigger the next miidewaer that needed protection
       
      }catch(err){
       
       throw new ForBiddenError('access denied')
 
      }
}

module.exports=authenticaionMiddleware;