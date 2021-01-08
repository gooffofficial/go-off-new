//Schema for chat rooms
const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  DMSchema  =  new Schema({
        users: {
            type: [{
              type: String
            }]
            //validate: [arrayLimit, '{PATH} exceeds the limit of 5'] //Throws an error - needs to handle
          },
          identifier:{
            type: String
          },
          status: {
            type: Boolean,
            default: false
          },
    messages: [{type: Schema.Types.ObjectId, ref: 'Chat'}], //holds user&message - relationship to chat
    
});
function arrayLimit(val) { //set a cap on amount of users
    return val.length <= 5;
    //verify if they're already in the list or not?
    
}

let  DirectMessage  =  mongoose.model('DirectMessage', DMSchema);
module.exports  =  DirectMessage;