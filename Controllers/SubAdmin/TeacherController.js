const UserModel = require("../../Models/User"); 
const bcrypt = require("bcrypt");

// Get All Classrooms
const getTeachers = async (req, res) => {
    try {
        const { id: userId, role } = req.user;

        // Allow only Sub Admin
        if (role !== "subadmin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only Sub Admin can access this resource.",
            });
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const { count, rows: teachers } = await UserModel.findAndCountAll({
            where: {
                sub_admin_id: userId,
                role: "teacher",
            },
            attributes: [
                "id",
                "first_name",
                "last_name",
                "email",
                "gender",
                "phone",
                "role",
                "last_login_at",
                "status",
                "dob",
                "father_name",
                "mother_name",
                "married",
                "profile_pic",
                "spouse_name",
                "created_at",
            ],
            order: [["id", "DESC"]],
            limit,
            offset,
        });

        return res.status(200).json({
            success: true,
            message: "Teachers fetched successfully.",
            data: teachers,
            pagination: {
                totalRecords: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                perPage: limit,
                hasNextPage: page < Math.ceil(count / limit),
                hasPreviousPage: page > 1,
            },
        });
    } catch (error) {
        console.error("Get Teachers Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching teachers.",
        });
    }
};

// Update Classroom


const updateTeacher = async (req, res) => {
    try {
        const { id: userId, role } = req.user;

        // Allow only Sub Admin
        if (role !== "subadmin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only Sub Admin can access this resource.",
            });
        }

        const { id } = req.params;

        // Copy request body
        const updated = { ...req.body };

        // Prevent updating restricted fields
        delete updated.id;
        delete updated.role;
        delete updated.sub_admin_id;
        delete updated.created_at;
        delete updated.updated_at;

        // Find teacher belonging to this subadmin
        const teacher = await UserModel.findOne({
            where: {
                id,
                sub_admin_id: userId,
                role: "teacher",
            },
        });

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found.",
            });
        }

        // Hash password if provided
        if (updated.password) {
            updated.password = await bcrypt.hash(updated.password, 10);
        }

        if (req.file) {
            updated.profile_pic = `uploads/profile_pics/${req.file.filename}`;
        }

        // Update teacher
        await teacher.update(updated);

        // Remove password from response
        const teacherData = teacher.toJSON();
        delete teacherData.password;

        return res.status(200).json({
            success: true,
            message: "Teacher updated successfully.",
            data: teacherData,
        });

    } catch (error) {
        console.error("Update Teacher Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the teacher.",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

// const deleteClassroom = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const classroom = await ClassroomModel.findOne({
//             where: {
//                 id: id
//             }
//         });

//         if (!classroom) {
//             return res.status(200).json({
//                 success: false,
//                 message: "Classroom not found.",
//             });
//         }

//          await ClassroomModel.destroy({
//             where: { id }
//         });

//         return res.status(200).json({
//             success: true,
//             message: "Classroom deleted successfully.",
//         });
//     } catch (error) {
//         console.error("Delete Classroom Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

module.exports = {
    getTeachers,
    updateTeacher,
};