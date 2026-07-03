const Joi = require('joi');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
});

// const signupValidation = async (req, res, next) => {
//     const schema = Joi.object({
//         first_name: Joi.string().min(3).max(100).required(),
//         email: Joi.string().email().required(),
//         last_name: Joi.string().optional(),
//         role: Joi.string().optional(),
//         password: Joi.string().min(4).max(100).optional(),
//         phone: Joi.string().optional(),
//         spouse_name: Joi.string().optional(),
//         father_name: Joi.string().optional(),
//         mother_name: Joi.string().optional(),
//         dob: Joi.string().optional(),
//     });

//     const { error } = schema.validate(req.body);
//     if (error) {
//         return res.status(400).json({ message: "Bad request", error });
//     }

//     try {
//         const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [req.body.email]);
//         if (rows.length > 0) {
//             return res.status(400).json({ message: "Email already registered" });
//         }
//     } catch (err) {
//         console.error("DB error during email check:", err);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }

//     next();
// };

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        login: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error });
    }
    next();
};

module.exports = {
  //  signupValidation,
    loginValidation
};
