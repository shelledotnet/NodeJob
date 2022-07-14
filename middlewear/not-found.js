const {v4:uuid}=require('uuid');
const notFound=(req,res)=>res.status(404).json({data:"route doesn't exist",code:404,success:false,ref:uuid()});

module.exports=notFound;