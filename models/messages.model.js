const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('debug', true);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

var msgSchema = new Schema({

  msgFrom : {type:String,default:"",required:true},
  msgTo : {type:String,default:"",required:true},
  msg : {type:String,default:"",required:true},
  room : {type:String,default:"",required:true},
  createdOn : {type:Date,default:Date.now}

});

var Msg = mongoose.model('Msg', msgSchema, "Messages");
module.exports = Msg;