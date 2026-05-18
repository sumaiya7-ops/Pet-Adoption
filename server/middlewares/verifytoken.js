const jwt = require('jsonwebtoken');

// প্রাইভেট রুট ও এপিআই সুরক্ষার জন্য কাস্টম জেডব্লিউটি মিডলওয়্যার
const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;
    
    if (!token) {
        return res.status(401).send({ message: 'Unauthorized Access: Missing Token' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden Access: Invalid Token' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;
