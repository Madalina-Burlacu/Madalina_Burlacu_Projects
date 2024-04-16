const Shifts = require("./shiftsModel");
const Comments = require("../Comments/commentsModel");
const User = require("../Users/userModel");
const mongoose =  require("mongoose");

//localhost:2000/api/shifts/createShifts
exports.createShifts = async (request, response) => {
    try {
        const userId = request.userIdFromToken;

        request.body.userId = userId;

        const newShift = request.body;

        let createdShift = await Shifts.create(request.body);

        response.status(200).json({
            status: "success",
            message: "New shift was created successfully!",
            data: createdShift,
        });
    } catch (err) {
        response.status(400).json({
            status: "failed",
            message: err.message,
        });
    }
};

//localhost:2000/api/shifts/:id
exports.getShiftById = async (request, response) => {
    try {
        let shift = await Shifts.findById(request.params.id).lean().populate({
            path: "comment",
            select: "description"
        });

        const userId = request.userIdFromToken;
        const userBring = await User.findById(userId);

        if (!shift) {
            return response.status(200).json({
                status: "failed",
                message: `Shift with id ${request.params.id} not found`,
            });
        }

        console.log("userId:", userId);
        console.log("shift.userId:", shift.userId);
        console.log("userBring.role:", userBring.role);
        if (userId == shift.userId || userBring.role === "admin") {
            response.status(200).json({
                status: "success",
                data: shift,
            });
        } else {
            return response.status(403).json({
                status: "failed",
                message: "You are not allowed to get this information",
            });
        }
    } catch (err) {
        response.status(404).json({
            status: "failed",
            message: err.message,
        });
    }
};

// localhost:2000/api/shifts
exports.showAllShifts = async (request, response) => {
    const currentUserLoggedId = request.user.id; //daca vreau sa nu afisez shift-urile userului logat
    const allShifts = await Shifts.find()
        .lean()
        .populate({
            path: "comment",
            select: "description",
        });
    return response.status(200).json({
        status: "All shifts are here!",
        length: allShifts.length,
        data: allShifts,
    });
};

// localhost:2000/api/shifts/shiftsUserLogged
exports.showShiftsOfUserLogged = async (request, response) => {
    try {
        const currentUserLoggedId = request.user.id;

        const allShiftsUserLogged = await Shifts.find({
            userId: currentUserLoggedId,
        })
            .lean()
            .populate({
                path: "comment",
                select: "description",
            });

        response.status(200).json({
            status: "success",
            data: allShiftsUserLogged,
        });
    } catch (err) {
        response.status(404).json({
            status: "failed",
            message: err.message,
        });
    }
};

//localhost:2000/api/shifts/deleteShift
exports.deleteShift = async (request, response) => {
    try {
        const idShiftToDelete = request.params.id;

        const shiftFinded = await Shifts.findById(idShiftToDelete);

        if (!shiftFinded) {
            return response.status(404).json({
                status: "failed",
                message: "Shift not found!",
            });
        }

        await Comments.deleteMany({ shiftId: idShiftToDelete });

        await Shifts.findByIdAndDelete(idShiftToDelete);

        response.status(200).json({
            status: "Success",
            message: `The shift with the ID ${idShiftToDelete} has been deleted`,
            data: null,
        });
    } catch (err) {
        response.status(400).json({
            status: "Failed",
            message: err.message,
        });
    }
};

//localhost:2000/api/shifts/updateShift/:id
exports.updateShiftById = async (request, response) => {
    try {
        if (Object.keys(request.body).length === 0) {
            return response.status(400).json({
                status: "failed",
                message:
                    "Request body is empty. Please provide the necessary data.",
            });
        }

        const idShiftToFind = request.params.id;
        const userId = request.userIdFromToken;
        const userBring = await User.findById(userId);

        let shiftToUpdate = await Shifts.findById(idShiftToFind);

        console.log("userId:", userId);
        console.log("shift.userId:", shiftToUpdate.userId);
        console.log("userBring.role:", userBring.role);

        if (!shiftToUpdate) {
            return response.status(403).json({
                status: "failed",
                message: "Shift not found!",
                data: shiftToUpdate,
            });
        }

        if (userId == shiftToUpdate.userId || userBring.role === "admin") {
            let updatedShift = await Shifts.findByIdAndUpdate(
                idShiftToFind,
                {...request.body,
                    updated: Date.now(),
                },
                
                { new: true, runValidators: true}
            );
            // shiftToUpdate.updated = Date.now();

            updatedShift.hoursWorked = updatedShift.calculateHoursWorked();
            updatedShift.payPerShift = updatedShift.calculatePayPerShift();

            await updatedShift.save();

            response.status(200).json({
                status: "success",
                data: updatedShift,
            });
        } else {
            return response.status(403).json({
                status: "failed",
                message: "You are not allowed to get this information",
            });
        }
    } catch (err) {
        response.status(404).json({
            status: "failed",
            message: err.message,
        });
    }
};

//localhost:2000/api/shifts/getShiftByShiftName/:shiftName
// exports.getShiftsByShiftName = async (request, response) => {
//     try {

//         let shiftName = request.params.shiftName;
//         const userId = request.userIdFromToken;
//         const userBring = await User.findById(userId);

//         let shiftFound = await Shifts.findOne({ shiftName })
//             .lean()
//             .populate({
//                 path: "user",
//                 select: "email firstname lastname",
//             })
//             .populate({
//                 path: "comment",
//                 select: "description",
//             });

//         response.status(200).json({
//             status: "Shift Found",
//             data: shiftFound,
//         });
//     } catch (err) {
//         response.status(404).json({
//             status: "failed",
//             message: err.message,
//         });
//     }
// };

//localhost:2000/api/shifts/statistics

exports.shiftsStatisticsAdmin = async (request, response) => {
    try {
        let matchUser = {};
        let groupField = null;

        const statisticsShifts = await Shifts.aggregate([
            { $match: matchUser },
            {
                $group: {
                    _id: "$userId",
                    averageEarnPerShift: { $avg: "$payPerShift" },
                    minEarnPerHour: { $min: "$pricePerHour" },
                    maxEarnPerHour: { $max: "$pricePerHour" },
                    productiveShift: { $max: "$payPerShift" },
                    totalHours: { $sum: "$hoursWorked" },
                    totalEarned: { $sum: "$payPerShift" },
                    totalShifts: { $sum: 1 },
                },
            },
        ]);

        console.log(matchUser);
        console.log("STATISTICS SHIFTS: ", statisticsShifts);

        let summaryForAdmin = await Shifts.aggregate([
            {
                $group: {
                    _id: null,
                    totalHours: { $sum: "$hoursWorked" },
                    totalEarned: { $sum: "$payPerShift" },
                    totalShifts: { $sum: 1 },
                },
            },
        ]);

        let mostProductiveUsers = await Shifts.aggregate([
            {
                $group: {
                    _id: "$userId",
                    maxProductivity: { $max: "$payPerShift" },
                },
            },
            { $sort: { maxProductivity: -1 } },
        ]);

        if (mostProductiveUsers && mostProductiveUsers.length > 0) {
            const userIds = mostProductiveUsers.map((user) => user._id);

            const usersInfo = await User.find(
                { _id: { $in: userIds } },
                { _id: 1, firstname: 1, lastname: 1 }
            );

            response.status(200).json({
                status: "success",
                mostProductiveUsers: usersInfo,
                summaryForAdmin: summaryForAdmin,
                data: statisticsShifts,
            });
        } else {
            response.status(200).json({
                status: "success",
                data: statisticsShifts,
                summaryForAdmin: summaryForAdmin,
                mostProductiveUsers: null,
            });
        }
    } catch (err) {
        response.status(404).json({
            status: "failed",
            message: err.message,
        });
    }
};

exports.shiftsStatisticsUser = async (request, response) => {
    try {
        const userId = request.user.id;
        console.log(userId)
        const statisticsShifts = await Shifts.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId) // Convert string to ObjectId
                }
            },
            {
                $group: {
                    _id: null,
                    averageEarnPerShift: { $avg: "$payPerShift" },
                    minEarnPerHour: { $min: "$pricePerHour" },
                    maxEarnPerHour: { $max: "$pricePerHour" },
                    productiveShift: { $max: "$payPerShift" },
                    totalHours: { $sum: "$hoursWorked" },
                    totalEarned: { $sum: "$payPerShift" },
                    totalShifts: { $sum: 1 },
                },
            },
        ]);
        response.status(200).json({
            status: "success",
            data: statisticsShifts,
        });
    } catch (err) {
        response.status(404).json({
            status: "failed",
            message: err.message,
        });
    }
};
