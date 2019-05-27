var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var msgSchema = new Schema({

    msgFrom : {
        type:String,
        default:"",
        required:true
    },
    msgTo : {
        type:String,
        default:"",
        required:true
    },
    msg : {
        type:String,
        default:"",
        required:true
    },
    room : {
        type:String,
        default:"",
        required:true
    },
    created : {
        type:Date,
        default:Date.now
    }

});

var Messages = mongoose.model('Messages', msgSchema, 'messages');
module.exports = Messages;