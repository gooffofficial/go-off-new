//Schema for chat messages
const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  chatSchema  =  new Schema({
    name: {type: String},
    message: {type: String},
    room: {type: Schema.Types.ObjectId, ref: 'Room'} //relationship to room
});

let  Chat  =  mongoose.model("Chat", chatSchema);
module.exports  =  Chat;