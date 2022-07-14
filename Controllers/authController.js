const JobUser=require('../model/UserModel');
const {v4:uuid}=require('uuid');
const {BadRequest,UnAuthenticatedError,NotFound}=require('../errors');
const bycrypt=require('bcryptjs');
const {StatusCodes}=require('http-status-codes')


const register=async(req,res)=>{
    const {name,email,password}=req.body;
    const newUser={name,email,password};
    const users=await JobUser.create(newUser)
    const newFT={id:users.getId(),name:users.getName(),token:users.creatJWT()};
    return res.status(StatusCodes.CREATED).json({data:newFT,success:true,ref:uuid()});
}
const login=async(req,res)=>{
    const {email,password}=req.body;
    console.log({'email':email,'password':password});
    if(email && password){
      const user= await JobUser.findOne({email});
      console.log(user);
      if(user){
      const isPasswordCorrect= await user.comparePassword(password)
        if(isPasswordCorrect){
             const newFT={id:user._id,name:user.name,token:user.creatJWT()};
             return res.status(StatusCodes.OK).json({data:newFT,code:StatusCodes.OK,success:true,ref:uuid()});
        }
        throw new UnAuthenticatedError(`access denied`)

      }
      throw new NotFound(`invalid email ${email} `)
    }
    throw new BadRequest(`email/password required`)
}
module.exports={register,login}