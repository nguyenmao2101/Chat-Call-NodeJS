var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = new Schema({

    name1 : {
        type:String,
        default:"",
        required:true
        },
    name2 : {
        type:String,
        default:"",
        required:true
    },
    members : [],
    lastOnline : {
        type:Date,
        default:Date.now
    },
    created : {
        type:Date,
        default:Date.now
    }

});

var Rooms = mongoose.model('Rooms',roomSchema, 'rooms');
module.exports = Rooms;