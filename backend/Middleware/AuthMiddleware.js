const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Extract token from "Bearer <token>"
    

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Please log in or sign up to continue.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded._id;


        next();
    } catch (error) {
        
        return res.status(401).json({ message: 'Invalid or expired session. Please log in again or sign up.' });
    }
};

module.exports = { verifyToken };


