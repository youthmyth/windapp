
module.exports={
	BadRequest:function(message){
    return createError(400,message);
	},
	NotFound:function(message){
    return createError(404,message);
	},
  create:createError,
  Unauthorized:function(message){
    return createError(401,message);
  }
}
function createError(status,message){
  if(typeof(message)=='object'){
    message=JSON.stringify(message);
  }
  var err=new Error(message);
  err.status=status;
  return err;
}
