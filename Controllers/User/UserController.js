const UserModel = require("../../Models/User"); 

const sendEmail = require('../../config/mailer');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');

const LoggedinUser = async (req, res) => {
    try {
        const users = await UserModel.findAll({
            where: { userType: 2 }
        });

        if (users.length === 0) {
            return res.status(404).json({
                message: "No users found with userType user",
                success: false
            });
        }

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile_pics'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `user_${Date.now()}${ext}`);
  }
});

const upload = multer({ storage }).single('profile_pic');


const updateUser = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(200).json({
          success: false,
          message: "User ID is required"
        });
      }

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      const user = await UserModel.findByPk(id);

      if (!user) {
        return res.status(200).json({
          success: false,
          message: "User not found"
        });
      }

      const updateData = { ...req.body };

      if (req.file) {
        updateData.profile_pic = `uploads/profile_pics/${req.file.filename}`;
      }

      await user.update(updateData);

      const userData = user.toJSON();
      delete userData.password;
      delete userData.created_at;
      delete userData.updated_at;
      delete userData.status;
      
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: userData
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(200).json({ success: false, message: 'Email is required' });
    }

    const generatePassword = () => {
        const length = 10;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    };

    try {
        const user = await UserModel.findOne({ where: { 
            email, 
            google_id: null 
          } });
        if (!user) {
            return res.status(200).json({ success: false, message: 'User not found' });
        }

        const newPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        await sendEmail(email, 'Password Reset - 40 Days Challenge', `
            <p>Hi ${user.name},</p>
            <p>Your new temporary password is:</p>
            <h3>${newPassword}</h3>
            <p>Please login and change it immediately.</p>
        `);

        res.status(200).json({
            success: true,
            message: 'New password has been sent to your email.'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(200).json({
            success: false,
            message: "User ID is required"
        });
    }

    try {
        const user = await UserModel.findByPk(id, {
          attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const notificationSettings = async (req, res) => {
   
    const { id, challenge_start, daily_reminder, missed_reminder, user_joined_challenge, warning_reminder } = req.body;

    if (!id) {
        return res.status(200).json({
            success: false,
            message: "User ID is required"
        });
    }

    try {
        const user = await UserModel.findByPk(id);
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "User not found"
            });
        }

        user.challenge_start = challenge_start;
        user.daily_reminder = daily_reminder;
        user.missed_reminder = missed_reminder;
        user.user_joined_challenge = user_joined_challenge;
        user.warning_reminder = warning_reminder;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Notification settings updated successfully",
           // data: user
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
}

const getNotificationSettings = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(200).json({
            success: false,
            message: "User ID is required"
        });
    }

    try {
        const user = await UserModel.findByPk(id, {
            attributes: ['challenge_start', 'daily_reminder', 'missed_reminder', 'user_joined_challenge', 'warning_reminder']
        });

        if (!user) {
            return res.status(200).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const getNotification = async (req, res) => {
  const { userid } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!userid) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  const offset = (page - 1) * limit;

  try {
    const { rows: notifications, count: total } = await NotificationModel.findAndCountAll({
      where: { creator_id: userid },
      attributes: {exclude: ['groupId','groupName']},
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    if (total === 0) {
      return res.status(200).json({
        success: true,
        message: "No notifications found",
        data: [],
        currentPage: page,
        totalPages: 0,
        totalItems: 0
      });
    }

    res.status(200).json({
      success: true,
      data: notifications,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};

const deleteAccount = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(200).json({
      success: false,
      message: "User ID is required"
    });
  }

  try {
    const user = await UserModel.findByPk(id);
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found"
      });
    }

    await user.destroy();
    await UserChallengeModel.destroy({ where: { user_id: id } });
    await UserChallengeAcceptance.destroy({ where: { user_id: id } });
    await UserChallengeLogModel.destroy({ where: { user_id: id } });
    await GroupChat.destroy({ where: { user_id: id } });
    await GroupChatMember.destroy({ where: { user_id: id } });  
    await TrophyModel.destroy({ where: { user_id: id } });
    await FollowersModel.destroy({ where: { creator_id: id } });
    await NotificationModel.destroy({ where: { creator_id: id } });

    res.status(200).json({
      success: true,
      message: "User account deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
}



module.exports = { LoggedinUser, updateUser, forgotPassword, getUserById, deleteAccount };
