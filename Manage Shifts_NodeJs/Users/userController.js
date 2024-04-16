const User = require("./userModel");
const Shifts = require("../Shifts/shiftsModel");
const Comments = require("../Comments/commentsModel");

const jwt = require("jsonwebtoken");
const util = require("util");
const sendEmail = require("../email");

// localhost:2000/api/user/sign-up
exports.signup = async (request, response) => {
    try {
        const {
            firstname,
            lastname,
            age,
            username,
            email,
            password,
            department,
        } = request.body;

        const newUser = await User.create({
            firstname,
            lastname,
            age,
            username,
            email,
            password,
            department,
        });

        response.status(201).json({
            status: "success",
            User: newUser,
        });
    } catch (err) {
        response.status(400).json({
            status: "failed",
            message: err.message,
        });
    }
};

// localhost:2000/api/user/login
exports.login = async (request, response) => {
    try {
        const email = request.body.email;
        const password = request.body.password;

        // check if receive the e-mail and pass in request body
        if (!email || !password) {
            return response.status(400).json({
                status: "failed",
                message: "Error in receive the email and password!",
            });
        }

        // search the user in MongoDB collection
        const userDB = await User.findOne({ email });
        console.log(userDB);

        // check if the email address exist and if the password is correct
        if (
            !userDB ||
            !(await userDB.comparePassword(password, userDB.password))
        ) {
            return response.status(400).json({
                status: "failed",
                message: "Email or Password is incorrect",
            });
        }

        // jwt token generate
        const token = jwt.sign({ id: userDB._id }, process.env.SECRET_STR, {
            expiresIn: process.env.EXPIRATION_TIME,
        });
        response.status(200).json({
            status: "success",
            token,
            data: userDB,
        });
    } catch (err) {
        response.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

// localhost:2000/api/user
exports.showallusers = async (request, response) => {
    // try{
    const currentUserLoggedId = request.user.id;
    const allUsers = await User.find({ _id: { $ne: currentUserLoggedId } })
        .lean()
        .populate({
            path: "shiftsList",
            select: "_id hoursWorked payPerShift",
            strictPopulate: false
        })
        .populate({
            path: "commentsList",
            select: "_id description",
            strictPopulate: false
        })
    return response.status(200).json({
        status: "All users are here!",
        length: allUsers.length,
        data: allUsers,
    });
    // }catch (err) {
    //     response.status(400).json({
    //         status: "Failed in bring all users.",
    //         message: err.message,
    //     });
    // }
};

//localhost:2000/api/user/:id
exports.getUserById = async (request, response) => {
    try {
        let userFound = await User.findById(request.params.id)
            .lean()
            .populate({
                path: "shiftsList",
                select: "pricePerHour hoursWorked payPerShift",
            })
            .populate({
                path: "commentsList",
                select: "shiftId description",
            });
        response.status(200).json({
            status: "User was found!",
            data: userFound,
        });
    } catch (err) {
        response.status(404).json({
            status: "Failed in bring the user by ID.",
            message: err.message,
        });
    }
};

//localhost:2000/api/user/getUserByEmail/:email
exports.getUserByEmail = async (request, response) => {
    try {
        let email = request.params.email;
        let userFound = await User.findOne({ email })
            .lean()
            .populate({
                path: "shiftsList",
                select: "pricePerHour hoursWorked payPerShift",
            })
            .populate({
                path: "commentsList",
                select: "shiftId description",
            });
        response.status(200).json({
            status: "User was found!",
            data: userFound,
        });
    } catch (err) {
        response.status(404).json({
            status: "Failed in bring the user by email.",
            message: err.message,
        });
    }
};

// localhost:2000/api/user/delete/:id
exports.deleteUserById = async (request, response) => {
    try {
        const userIdToDelete = request.params.id;

        const userToDelete = await User.findById(userIdToDelete);

        if (!userToDelete) {
            return response.status(404).json({
                status: "failed",
                message: "User not found!",
            });
        }

        await Shifts.deleteMany({ userId: userIdToDelete });
        await Comments.deleteMany({ userId: userIdToDelete });

        await User.findByIdAndDelete(userIdToDelete);

        response.status(200).json({
            status: "User was deleted successfully!",
            data: null,
        });
    } catch (err) {
        response.status(404).json({
            status: "Error in delete user by ID. User not found",
            message: err.message,
        });
    }
};

//localhost:2000/api/user/updateUserInfo
exports.updateUserInfo = async (request, response) => {
    // if the user try to update the password throw error
    try {
        if (request.body.password) {
            return response.status(400).json({
                status: "failed",
                message:
                    "This route isn't for update password. For update password use /updatePassword.",
            });
        }

        if (request.body.department) {
            return response.status(400).json({
                status: "failed",
                message: "Just the admin can update the department.",
            });
        }

        if (Object.keys(request.body).length === 0) {
            return response.status(400).json({
                status: "failed",
                message:
                    "Request body is empty. Please provide the necessary data.",
            });
        }

        // update user data
        const updatedUser = await User.findByIdAndUpdate(
            { _id: request.user.id },
            { ...request.body, updated: Date.now() },
            { new: true, runValidators: true }
        );

        //updatedUser.updated = Date.now();

        return response.status(200).json({
            status: "success",
            data: updatedUser,
        });
    } catch (err) {
        response.status(400).json({
            status: "error",
            message: err.message,
        });
    }
};

// localhost:api/user/updatePassword
exports.updatePassword = async (request, response) => {
    // if the user try to update anything than pssword
    const allowedFields = ["password", "newPassword"];

    const invalidFields = Object.keys(request.body).filter(
        (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
        return response.status(400).json({
            status: "failed",
            message:
                "To update anything than password please use the route /updateUserInfo.",
        });
    }

    if (!request.body.password || !request.body.newPassword) {
        return response.status(400).json({
            status: "failed",
            message:
                "To update the password you need to insert the old password and the new password.",
        });
    }

    if (Object.keys(request.body).length === 0) {
        return response.status(400).json({
            status: "failed",
            message:
                "Request body is empty. Please provide the necessary data.",
        });
    }

    // 1. Bring the user from collection based on ID
    const userLogged = await User.findById(request.user.id);

    // 2. Check if the current pass fits
    if (
        !(await userLogged.comparePassword(
            request.body.password,
            userLogged.password
        ))
    ) {
        return response.status(404).json({
            status: "fail",
            message: "Incorrect password",
        });
    }

    // 3. Update password
    userLogged.password = request.body.newPassword;
    userLogged.passwordChangedAt = Date.now();
    await userLogged.save();

    // 4. Relogged the user with the new pass
    const jwtTok = jwt.sign({ id: userLogged._id }, process.env.SECRET_STR, {
        expiresIn: process.env.EXPIRATION_TIME,
    });

    return response.status(200).json({
        status: "success",
        jwtTok,
        data: userLogged,
    });
};

// localhost:2000/api/user/forgotPassword
exports.forgotPassword = async (request, response) => {
    // error message if the user didn't offer the email address
    const allowedFields = ["email"];

    const invalidFields = Object.keys(request.body).filter(
        (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
        return response.status(400).json({
            status: "failed",
            message: "Please provide just the email address.",
        });
    }

    if (Object.keys(request.body).length === 0) {
        return response.status(400).json({
            status: "failed",
            message:
                "Request body is empty. Please provide the necessary data.",
        });
    }

    // 1. Search in database if the email address exist
    const userFinded = await User.findOne({ email: request.body.email });

    if (!userFinded) {
        return response.status(404).json({
            status: "Failed",
            message: "User not found!",
        });
    }

    // 2. Generate random token
    const resetToken = await userFinded.createNewPasswordToken();
    await userFinded.save();

    // 3. Sending the e-mail to the user using nodemailer/mailtrap
    const url = `${request.protocol}://${request.get(
        "host"
    )}/api/user/resetpassword/${resetToken}`;
    const message = `Follow this link to reset you password\n\n${url}. This link for reset password is available 10 minutes.`;

    try {
        await sendEmail({
            email: userFinded.email,
            subject: "Reset your password",
            message: message,
        });

        return response.status(200).json({
            status: "Success!",
            message: `An email was sent to ${userFinded.email}. Follow the instructions on that email to complete the process.`,
            data: userFinded.passwordResetToken,
        });
    } catch (err) {
        userFinded.passwordResetToken = undefined;
        userFinded.passwordResetExpires = undefined;

        await userFinded.save();
        return response.status(500).json({
            status: "failed",
            message: err.message,
            data: userFinded.email,
        });
    }
};

// localhost:2000/api/user/resetpassword/:token
exports.resetpassword = async (request, response) => {
    const allowedFields = ["password"];

    const invalidFields = Object.keys(request.body).filter(
        (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
        return response.status(400).json({
            status: "failed",
            message: "Please provide just the password.",
        });
    }

    if (Object.keys(request.body).length === 0) {
        return response.status(400).json({
            status: "failed",
            message:
                "Request body is empty. Please provide the necessary data.",
        });
    }

    // 1. search the user in database based on token for reset password and if is a valid token
    const userToResetPass = await User.findOne({
        passwordResetToken: request.params.token,
        passwordResetTokenExpires: { $gt: Date.now() },
    });

    console.log(userToResetPass);

    if (!userToResetPass) {
        return response.status(400).json({
            status: "fail",
            message: "Invalid or expired token!",
            data: userToResetPass,
        });
    }

    // 2. Reset password
    userToResetPass.password = request.body.password;
    userToResetPass.passwordResetToken = undefined;
    userToResetPass.passwordResetTokenExpires = undefined;
    userToResetPass.passwordChangedAt = Date.now();
    userToResetPass.save();

    // 3. Log the user after he changed the password
    const jwtToken = jwt.sign(
        { id: userToResetPass._id },
        process.env.SECRET_STR,
        {
            expiresIn: process.env.EXPIRATION_TIME,
        }
    );

    return response.status(200).json({
        status: "success",
        jwtToken,
        data: userToResetPass,
    });
};

// update user by admin without password
// localhost:2000/api/user/:id
exports.updateUserByAdmin = async (request, response) => {
    try {
        if (request.body.password) {
            return response.status(400).json({
                status: "failed",
                message:
                    "You don't have the permission to update the password for other user.",
            });
        }

        if (request.body.department === "HR") {
            request.body.role = "admin";
        } else {
            request.body.role = "user";
        }

        if (Object.keys(request.body).length === 0) {
            return response.status(400).json({
                status: "failed",
                message:
                    "Request body is empty. Please provide the necessary data.",
            });
        }

        let userToUpdate = await User.findByIdAndUpdate(
            request.params.id,
            { ...request.body, updated: Date.now() },
            { new: true, runValidators: true }
        );

        //userToUpdate.updated = Date.now();

        return response.status(200).json({
            status: "success",
            message: userToUpdate,
        });
    } catch (err) {
        response.status(404).json({
            status: "failed",
            message: err.message,
        });
    }
};

exports.protect = async (request, response, next) => {
    try {
        // 1. check if the request contains the token and if contains, we read it
        const valueToken = request.headers.authorization;
        let token;
        if (valueToken && valueToken.startsWith("bearer")) {
            token = valueToken.split(" ")[1];
        }

        if (!token) {
            return response.status(401).json({
                status: "failed",
                message: "You are not logged in!",
            });
        }

        // 2. Check if the token is valid.
        const decodeToken = await util.promisify(jwt.verify)(
            token,
            process.env.SECRET_STR
        );

        // 3. Check if the user exist in our database
        const loggedUser = await User.findById(decodeToken.id);
        if (!loggedUser) {
            return response.status(401).json({
                status: "fail",
                message: "The user  who tried to authenticate doesn't exist.",
            });
        }

        // 4. Check id the user changed his password after login
        if (await loggedUser.isPasswordChanged(decodeToken.iat)) {
            return response.status(401).json({
                status: "failed",
                message: "Your password was changed, please login again!",
            });
        }

        // 5. Allow the user to access the route
        request.user = loggedUser;
        console.log(request.user.role);
        next();
    } catch (err) {
        response.status(400).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.permission = async (request, response, next) => {
    if (request.user && request.user.role && request.user.role == "admin") {
        next();
    } else {
        return response.status(403).json({
            status: "failed",
            message: "You must be admin to access this functionality.",
        });
    }
};
