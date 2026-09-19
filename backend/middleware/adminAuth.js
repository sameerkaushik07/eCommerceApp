

import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        
        const {token} = req.headers;
        if(!token){
            return res.json({success:false,message:"Not authorized login again"})
        }

        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        if(token_decode.role !== 'admin'){
            return res.status(401).json({success:false,message:"Not authorized login again"})
        }
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({success:false,message:"Authorization failed"})
    
    }
}
export default adminAuth;