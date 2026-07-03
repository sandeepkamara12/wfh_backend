const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User'); // Sequelize model
const admin = require("firebase-admin");
const User = require('../Models/User');
const { Op } = require('sequelize');


const signup = async (req, res) => {
    try {
        const { email } = req.body;
console.log(req.body);

if (!req.body.email) {
    return res.status(400).json({
        success: false,
        message: "Email missing",
        body: req.body
    });
}
        const user = await UserModel.findOne({
            where: { email }
        });

        if (user) {
            return res.status(200).json({
                message: "User already exists, you can login",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash("123456", 10);

        const profilePic = req.file
            ? req.file.path
            : null;

        await UserModel.create({
            ...req.body,
            password: hashedPassword,
            profile_pic: profilePic
        });

        return res.status(200).json({
            message: "Signup successful",
            success: true
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/profile_pics/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;

        const isValid =
            allowedTypes.test(file.mimetype) &&
            allowedTypes.test(path.extname(file.originalname).toLowerCase());

        if (isValid) {
            return cb(null, true);
        }

        return cb(
            new Error('Only jpeg, jpg, png, and webp files are allowed')
        );
    }
});

const subAdminsignup = async (req, res) => {
    try {
        const { first_name, last_name, email, password} = req.body;
        const user = await UserModel.findOne({ where: { email } });
        if (user) {
            return res.status(200).json({
                message: 'User already exists, you can login',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.create({
            first_name, 
            last_name,
            email,
            password: hashedPassword,
            role : "subadmin",
        });

        res.status(200).json({
            message: "Signup successful",
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const login = async (req, res) => {
  try {
    const { login, password } = req.body; // login = email or phone
    const errorMsg = 'Email/Phone or password is wrong';

    const user = await UserModel.findOne({
      where: {
        [Op.or]: [
          { email: login },
          { phone: login }
        ],
        status: 1
      }
    });

    if (!user) {
      return res.status(200).json({
        message: errorMsg,
        success: false
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(200).json({
        message: errorMsg,
        success: false
      });
    }

    const jwtToken = jwt.sign(
      {
        email: user.email,
        id: user.id,
        role: user.role,
        status: user.status
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Login Success',
      success: true,
      jwtToken,
      id: user.id,
      email: user.email,
      phone: user.phone,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_pic: user.profile_pic,
      role: user.role,
      father_name: user.father_name,
      mother_name: user.mother_name,
      married: user.married,
      spouse_name: user.spouse_name,
      dob: user.dob,
      custom_id: user.custom_id,
      gender: user.gender,
      sub_admin_id: user.sub_admin_id
    });

  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: err.message
    });
  }
};


const changePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!id) {
        return res.status(200).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    try {
        const user = await UserModel.findByPk(id);
        if (!user) {
            return res.status(200).json({
                success: false,
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(200).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};


const logout = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(200).json({ success: false, message: "User ID is required" });
    } 

    UserModel.update(
      { fcm_token: null, first_time_login: 1 },
      { where: { id: userId } }
    );

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};

module.exports = {
    signup,
    subAdminsignup,
    login,
    changePassword,
    logout,
    upload
};
