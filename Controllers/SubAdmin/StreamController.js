const UserModel = require("../../Models/User"); 
const StreamModel = require("../../Models/Stream"); 

// Create Stream
const createStream = async (req, res) => {
    try {
        const { sub_admin_id, name } = req.body;

        if (!sub_admin_id || !name) {
            return res.status(200).json({
                success: false,
                message: "Sub Admin Id and Name are required."
            });
        }

        const result = await StreamModel.create({
            sub_admin_id,
            name,
        });

        return res.status(200).json({
            success: true,
            message: "Stream created successfully.",
            data: result,
        });
    } catch (error) {
        console.error("Create Stream Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Streams
const getStreams = async (req, res) => {
    try {
        const userId = req.user.id;
        const Streams = await StreamModel.findAll({
            where: {
                sub_admin_id: userId,
            },
});

        return res.status(200).json({
            success: true,
            data: Streams,
        });
    } catch (error) {
        console.error("Get Streams Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Stream By ID
const getStreamById = async (req, res) => {
    try {
        const { id } = req.params;

        const Stream = await StreamModel.findById(id);

        if (!Stream) {
            return res.status(200).json({
                success: false,
                message: "Stream not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: Stream,
        });
    } catch (error) {
        console.error("Get Stream Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Stream
const updateStream = async (req, res) => {
    try {
        const { id } = req.params;
        const { sub_admin_id, name } = req.body;

        const Stream = await StreamModel.findOne({
            where: {
                id: id
            }
        });

        if (!Stream) {
            return res.status(200).json({
                success: false,
                message: "Stream not found.",
            });
        }

        const result = await Stream.update(
            {
                sub_admin_id,
                name
            },
            {
                where: { id },
            }
        );

        return res.status(200).json({
            success: true,
            message: "Stream updated successfully.",
            data: result,
        });
    } catch (error) {
        console.error("Update Stream Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteStream = async (req, res) => {
    try {
        const { id } = req.params;

        const Stream = await StreamModel.findOne({
            where: {
                id: id
            }
        });

        if (!Stream) {
            return res.status(200).json({
                success: false,
                message: "Stream not found.",
            });
        }

         await StreamModel.destroy({
            where: { id }
        });

        return res.status(200).json({
            success: true,
            message: "Stream deleted successfully.",
        });
    } catch (error) {
        console.error("Delete Stream Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createStream,
    getStreams,
    getStreamById,
    updateStream,
    deleteStream
};