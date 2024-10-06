const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, 'keysecret');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};
const admin_authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, 'keysecret');
        req.admin = verified;
        console.log(req.admin)
        if (req.admin.adminId) { 
            next();
        } else {
            res.status(403).send('Access Denied: Admins only');
        }
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

module.exports = { 
    authenticateToken,
    admin_authenticateToken,
};
