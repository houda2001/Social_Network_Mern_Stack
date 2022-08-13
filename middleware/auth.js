const jwt =require('jsonwebtoken');

module.exports=function(req,res,next){

    //GET THE TOKEN FROM THE USER HEADER
    const token =req.header('x-auth-token');
    if(!token){
        res.status(500).json({msg:" No token Not authorized"})
    }
    const decoded =jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user=decoded.user;
    next();
}
