const jwt=require('jsonwebtoken');
require('dotenv').config();
const generateToken=(user)=>{
    //include userid and name in payload
     return jwt.sign(
        {userid:user.user_id,
            userrole:user.role
        },
        process.env.JWT_SECRET,
        { expiresIn:'1h'}
     );
};

const verifyToken=(token)=>{
    return jwt.verify(token,process.env.JWT_SECRET)
}

module.exports={generateToken,verifyToken};