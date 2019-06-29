const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('debug', true);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

var roomSchema = new Schema({

  name1 : {type:String,default:"",required:true},
  name2 : {type:String,default:"",required:true},
  members : [],
  lastActive : {type:Date,default:Date.now},
  createdOn : {type:Date,default:Date.now}

});

var Rooms = mongoose.model('Rooms', roomSchema, 'Rooms');
module.exports = Rooms;