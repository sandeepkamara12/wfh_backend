const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require("../../Models/User"); 

const Sequelize = require("sequelize");
const { Op, fn, col, where: whereFn, where, literal } = Sequelize;
const multer = require('multer');
const path = require('path');

const userData = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const offset = (page - 1) * limit;

  try {
  const { count, rows } = await UserModel.findAndCountAll({
  where: {
    userType: 'user',
    name: {
      [Op.like]: `%${search}%`
    }
  },
  include: [
    {
      model: UserChallengeAcceptance,
      as: 'acceptedChallenges',
      attributes: [] // Only used for COUNT
    }
  ],
  attributes: {
    exclude: ['password','dob','challenge_start','daily_reminder','missed_reminder','user_joined_challenge','warning_reminder','updated_at','fcm_token'], // 👈 exclude password here
    include: [
      [
        Sequelize.fn('COUNT', Sequelize.col('acceptedChallenges.id')),
        'challengeCount'
      ]
    ]
  },
  group: ['User.id'],
  limit,
  offset,
  subQuery: false
});

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found matching the criteria'
      });
    }

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count.length || count,
        page,
        limit,
        totalPages: Math.ceil((count.length || count) / limit)
      }
    });
  } catch (err) {
    console.error('Error in userData:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
};


const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UserModel.findOne({
            where: { id, userType: 'user' },
            attributes: { exclude: ['password'] } 
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

const updateUserById = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const [updated] = await UserModel.update(updates, {
            where: { id, userType: 'user' }
        });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const updatedUser = await UserModel.findOne({ where: { id } });

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

const deleteUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await UserModel.destroy({
            where: { id, userType: 'user' }
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

const activeDeactiveUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UserModel.findByPk(id);

        if (!user) {
            return res.status(200).json({
                success: false,
                message: 'User not found'
            });
        }

        const newStatus = user.status === 1 ? 0 : 1;
        user.status = newStatus;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`,
            data: user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

const adminprofile = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await UserModel.findOne({
            where: { id, userType: 'admin' },
            attributes: { exclude: ['password'] } 
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
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

const updateAdminUser = async (req, res) => {
    upload(req, res, async function (err) {
    const { id } = req.params;
    const { name, dob } = req.body;

    if (!id) {
      return res.status(200).json({
        success: false,
        message: "User ID is required"
      });
    }

    if (err) {
      return res.status(200).json({
        success: false,
        message: "File upload error",
        error: err.message
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

      // If new profile pic is uploaded, update the path
      let profilePicUrl = user.profile_pic;
      if (req.file) {
        profilePicUrl = `/uploads/profile_pics/${req.file.filename}`;
      }

      user.name = name || user.name;
      user.dob = dob || user.dob;
      user.profile_pic = profilePicUrl;

      await user.save();

      res.status(200).json({
        success: true,
        message: "User updated successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
        success: false,
        error: err.message
      });
    }
  });
};

module.exports = {
    userData,
    getUserById,
    updateUserById,
    deleteUserById,
    activeDeactiveUser,
    adminprofile,
    updateAdminUser
};