const mongoose = require('mongoose');
const Schema=mongoose.Schema;
ObjectId=Schema.ObjectId;
const userSchema=new Schema({
      _id: ObjectId,
      name:{type:String,require:true},
      bookImage:{type:Object,require:true},
      bookPdf:{type:Object,require:true}
});

module.exports=mongoose.model("Book",userSchema);