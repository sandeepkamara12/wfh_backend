const UserModel = require("../../Models/User"); 
const SectionModel = require("../../Models/Section"); 

// Create Section
const createSection = async (req, res) => {
    try {
        const { sub_admin_id, name } = req.body;

        if (!sub_admin_id || !name) {
            return res.status(200).json({
                success: false,
                message: "Sub Admin Id and Name are required."
            });
        }

        const result = await SectionModel.create({
            sub_admin_id,
            name,
        });

        return res.status(200).json({
            success: true,
            message: "Section created successfully.",
            data: result,
        });
    } catch (error) {
        console.error("Create Section Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Sections
const getSections = async (req, res) => {
    try {
        const userId = req.user.id;
        const Sections = await SectionModel.findAll({
            where: {
                sub_admin_id: userId,
            },
});

        return res.status(200).json({
            success: true,
            data: Sections,
        });
    } catch (error) {
        console.error("Get Sections Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Section By ID
const getSectionById = async (req, res) => {
    try {
        const { id } = req.params;

        const Section = await SectionModel.findById(id);

        if (!Section) {
            return res.status(200).json({
                success: false,
                message: "Section not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: Section,
        });
    } catch (error) {
        console.error("Get Section Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Section
const updateSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { sub_admin_id, name, stream } = req.body;

        const Section = await SectionModel.findOne({
            where: {
                id: id
            }
        });

        if (!Section) {
            return res.status(200).json({
                success: false,
                message: "Section not found.",
            });
        }

        const result = await Section.update(
            {
                sub_admin_id,
                name,
                ...(stream !== undefined && { stream }),
            },
            {
                where: { id },
            }
        );

        return res.status(200).json({
            success: true,
            message: "Section updated successfully.",
            data: result,
        });
    } catch (error) {
        console.error("Update Section Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteSection = async (req, res) => {
    try {
        const { id } = req.params;

        const Section = await SectionModel.findOne({
            where: {
                id: id
            }
        });

        if (!Section) {
            return res.status(200).json({
                success: false,
                message: "Section not found.",
            });
        }

         await SectionModel.destroy({
            where: { id }
        });

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully.",
        });
    } catch (error) {
        console.error("Delete Section Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createSection,
    getSections,
    getSectionById,
    updateSection,
    deleteSection
};