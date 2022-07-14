const mongoose = require('mongoose'); //elegant mongodb object modeling for node.js
const bycrypt=require('bcryptjs');
const Schema=mongoose.Schema;
const jwt=require('jsonwebtoken')

const UserSchema=new Schema({
    name:{
        type:String,
        required: [true,'name required'],
        trim:true,
        lowercase:true,
        maxlength:[50,'name exceed maximun character count of 50'],
        minlength:[5,'name below minimum character count of 5']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'email address required'],
        trim:true,
        lowercase:true,
        maxlength:[50,'email exceed maximun character count of 50'],
        minlength:[5,'email below minimum character count of 5'],
        match:[/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,'invalid email'],
       
    },
    password: {
        type: String,
        required:[true,'password required'],
        maxlength:[100,'password exceed maximun character count of 50'],
        minlength:[5,'password below minimum character count of 5']
      
      },
     
    CreatedAt:{
        type:Date,
        default:Date.now
    }
    
});
//before i save the password in the DB what do i want to accomplish
//i want to hash the password
UserSchema.pre('save',async function(){
    const salt=await bycrypt.genSalt(10);
    this.password=await bycrypt.hash(this.password,salt);
});

/*
Instances of Models are documents. Documents have many of their own built-in instance 
methods. We may also define our own custom document instance methods.
**********************************************************************************
*/

UserSchema.methods.getName=function(){
    return this.name
}
UserSchema.methods.getId=function(){
    return this._id
}
UserSchema.methods.creatJWT=function(){
      //just for Demo normally provided by the DB..
    //below are the jwt payloads signature
   //1..try to keep payload small a better experinece for user.. pls avoid your password/confindential info and let it be an object
   //2..just for demo in production use long complex and ungessable string value!!!!!
   return jwt.sign(
    {userId:this._id,username:this.name},
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_LIFETIME}   //time to expire (5min to 15min on prod)
    )
}

UserSchema.methods.comparePassword=async function(requestPassword){
   return  await bycrypt.compare(requestPassword,this.password);
}
module.exports=mongoose.model('JobUsers',UserSchema);