const mongoose = require('mongoose'); //elegant mongodb object modeling for node.js
const Schema=mongoose.Schema;

const JobSchema=new Schema({
    company:{
        type:String,
        required: [true,'please provide company name'],
        trim:true,
        enum:{
          values:['facebook','apple','netflix','google','microsoft'],
        message: '{VALUE} is not supported'
      },
        maxlength:[50,'exceed maximun character count of 50'],
        minlength:[5,'below minimum character count of 5']
    },
    position:{
        type:String,
        required:[true,'position must be provided'],
        maxlength:[100,'exceed maximun character count of 100'],
        minlength:[5,'below minimum character count of 5']
    },
    status: {
        type: String,
        enum:{
          values:['interview','pending','declined'],
        message: '{VALUE} is not supported'
      },
      default:'pending',
      },
      createdBy: {
        type: mongoose.Types.ObjectId,
        ref:'JobUsers',
        required:[true,'please provide created user']
      }
},{timestamps:true});
JobSchema.methods.getId=function(){
  return this._id
}
JobSchema.methods.companyName=function(){
  return this.company
}
module.exports=mongoose.model('Job',JobSchema);