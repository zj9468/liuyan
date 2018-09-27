var mongoose=require('../db').mongoose;
var schema=new mongoose.Schema({
    name:'string',
    password:'string'
});
var User=mongoose.model('User',schema);//构造(schema)架构
module.exports=User;