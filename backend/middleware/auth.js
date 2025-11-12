const jwt = require('jsonwebtoken');

// Verify JWT token and attach user to request
const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token', details: err.message });
    }
};

module.exports = authMiddleware;
