const mongoose = require('mongoose');
const {Schema} = mongoose;

const NotesSchema = new Schema({
//user is defined because only that particular user can have his notes access isiliya using foreign key
    user:{
        type: mongoose.Schema.Types.ObjectId,//FOREIGN KEY
        ref:'user'
    },

    title:{
        type: String,
        required:true
        
    },
    description:{
        type:String,
        required:true,
       
    },
    tag:{
        type:String,
        default: "General"
        
    },
    date:{
        type:Date,
        default:Date.now
    }


});

module.exports = mongoose.model('notes', NotesSchema);