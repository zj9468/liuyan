var settings=require("./settings");
var mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/study", {useNewUrlParser:true}, function(err){ 
　　if(err){ 
　　　　console.log('Connection Error:' + err) 
　　}else{ 
　　　　console.log('Connection success!') } 
});

var db=mongoose.connection;
module.exports={
    "dbCon":db,
    "mongoose":mongoose
};
