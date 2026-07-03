const UserModel = require("../../Models/User"); 
const ClassroomModel = require("../../Models/Classroom"); 

// Create Classroom
const createClassroom = async (req, res) => {
    try {
        const { sub_admin_id, name } = req.body;

        if (!sub_admin_id || !name) {
            return res.status(200).json({
                success: false,
                message: "Sub Admin Id and Name are required."
            });
        }

        const result = await ClassroomModel.create({
            sub_admin_id,
            name,
        });

        return res.status(200).json({
            success: true,
            message: "Classroom created successfully.",
            data: result,
        });
    } catch (error) {
        console.error("Create Classroom Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Classrooms
const getClassrooms = async (req, res) => {
    try {
        const userId = req.user.id;
        const classrooms = await ClassroomModel.findAll({
            where: {
                sub_admin_id: userId,
            },
});

        return res.status(200).json({
            success: true,
            data: classrooms,
        });
    } catch (error) {
        console.error("Get Classrooms Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Classroom By ID
const getClassroomById = async (req, res) => {
    try {
        const { id } = req.params;

        const classroom = await ClassroomModel.findById(id);

        if (!classroom) {
            return res.status(200).json({
                success: false,
                message: "Classroom not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: classroom,
        });
    } catch (error) {
        console.error("Get Classroom Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Classroom
const updateClassroom = async (req, res) => {
    try {
        const { id } = req.params;
        const { sub_admin_id, name } = req.body;

        const classroom = await ClassroomModel.findOne({
            where: {
                id: id
            }
        });

        if (!classroom) {
            return res.status(200).json({
                success: false,
                message: "Classroom not found.",
            });
        }

        const result = await classroom.update({
            sub_admin_id,
            name,
        });

        return res.status(200).json({
            success: true,
            message: "Classroom updated successfully.",
            data: result,
        });
    } catch (error) {
        console.error("Update Classroom Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteClassroom = async (req, res) => {
    try {
        const { id } = req.params;

        const classroom = await ClassroomModel.findOne({
            where: {
                id: id
            }
        });

        if (!classroom) {
            return res.status(200).json({
                success: false,
                message: "Classroom not found.",
            });
        }

         await ClassroomModel.destroy({
            where: { id }
        });

        return res.status(200).json({
            success: true,
            message: "Classroom deleted successfully.",
        });
    } catch (error) {
        console.error("Delete Classroom Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createClassroom,
    getClassrooms,
    getClassroomById,
    updateClassroom,
    deleteClassroom
};