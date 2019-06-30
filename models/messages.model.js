const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var msgSchema = new Schema({

  msgFrom : {type:String,default:"",required:true},
  msgTo : {type:String,default:"",required:true},
  msg : {type:String,default:"",required:true},
  room : {type:String,default:"",required:true},
  createdOn : {type:Date,default:Date.now}

});

var Msg = mongoose.model('Messages', msgSchema, "Messages");
module.exports = Msg;