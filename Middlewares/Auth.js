const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
});

const ensureAuthenticated = async (req, res, next) => {
    const auth = req.headers.authorization;

    if (!auth) {
        return res.status(401).json({
            message: 'Unauthorized, JWT token is required'
        });
    }

    const token = auth.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const [rows] = await pool.query(
            'SELECT id, role FROM users WHERE id = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                message: 'Unauthorized, user not found'
            });
        }

        req.user = rows[0];
        next();
    } catch (err) {
        console.error('JWT Verification or DB Error:', err);
        return res.status(401).json({
            message: 'Unauthorized, JWT token wrong or expired'
        });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    return res.status(403).json({
        message: 'Access denied: Admins only'
    });
};

const isSubadmin = (req, res, next) => {
    if (req.user && req.user.role === 'subadmin') {
        return next();
    }

    return res.status(403).json({
        message: 'Access denied: Subadmins only'
    });
};

const isTeacher = (req, res, next) => {
    if (req.user && req.user.role === 'teacher') {
        return next();
    }

    return res.status(403).json({
        message: 'Access denied: Teachers only'
    });
};

const isParent = (req, res, next) => {
    if (req.user && req.user.role === 'parent') {
        return next();
    }

    return res.status(403).json({
        message: 'Access denied: Parents only'
    });
};

module.exports = {
    ensureAuthenticated,
    isAdmin,
    isSubadmin,
    isTeacher,
    isParent
};