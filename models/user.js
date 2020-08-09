const mongoose = require('mongoose');
const Schema=mongoose.Schema;
ObjectId=Schema.ObjectId;
const userSchema=new Schema({
      _id: ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  password: { type: String, required: true }
})


module.exports=mongoose.model("User",userSchema);