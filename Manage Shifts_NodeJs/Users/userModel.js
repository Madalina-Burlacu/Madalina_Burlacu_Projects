const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: [true, "Please enter your firtsname!"],
        trim: true,
        validate: {
            validator: function (name) {
                const regexName = /^[A-Z][a-zA-Z]{1,}$/;
                return regexName.test(name);
            },
            message: `Only letters are allowed (min 2 characters) and the first one must be capitalized.`,
        },
    },
 
    
    lastname: {
        type: String,
        required: [true, "Please enter your lastname!"],
        trim: true,
        validate: {
            validator: function (name) {
                const regexName = /^[A-Z][a-zA-Z]{1,}$/;
                return regexName.test(name);
            },
            message: `Only letters are allowed (min 2 characters) and the first one must be capitalized.`,
        },
    },

    age: {
        type: Number,
        required: [true, "Please enter your age!"],
        trim: true,
        min: [18, "Every user must have at least 18 years."],
        max: [65, "Every user must maximum 65 years."],
    },

    username: {
        type: String,
        required: [true, "Username is required!"],
        unique: [true, "Username must be unique"],
        trim: true,
        validate: {
            validator: function (username) {
                const regexUsername =
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
                return regexUsername.test(username);
            },
            message: `Username must have an uppercase letter, a lowercase letter, a number and a special character. Username length must be eqaual or greaten than 6 characters`,
        },
    },

    email: {
        type: String,
        required: [true, "Email is required!"],
        validate: [validator.isEmail, "Please enter an valid e-mail!"],
        unique: [true, "This e-mail address already exists."],
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: [true, "Password is required!"],
        validate: {
            validator: function (pass) {
                const regexPassword =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
                return regexPassword.test(pass);
            },
            message:
                "Password must contain uppercase letter, lowercase letter, number and special character. Password lenght must be at least 8 characters.",
        },
    },

    department:{
        type: String,
        required: [true, 'Every user must have an department.'],
    },

    role: {
        type: String,
        default: function() {
            return this.department === 'HR' ? 'admin' : 'user';
        },
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date
    },

    passwordChangedAt: Date,

    passwordResetToken: String,

    passwordResetTokenExpires: Date,

});

UserSchema.virtual('shiftsList', {
    ref: 'shifts',
    foreignField: 'userId',
    localField: '_id'
});

UserSchema.virtual('commentsList', {
    ref: 'comments',
    foreignField: 'userId',
    localField: '_id'
});

UserSchema.pre("save", async function(next) {
    let user = this;
    if (!user.isModified("password")) {
        next();
    }
    this.password = await bcryptjs.hash(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = async function(passwordBody, passwordDB){
    return await bcryptjs.compare(passwordBody, passwordDB);
}

UserSchema.methods.isPasswordChanged = async function(jwtInitialTimeStamp){
    if(this.passwordChangedAt){
        const passTimeChanged = parseInt(this.passwordChangedAt / 1000);
        return jwtInitialTimeStamp < passTimeChanged;
    }
    return false;
}

UserSchema.methods.createNewPasswordToken = async function(){
    this.passwordResetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
    return this.passwordResetToken;

}

module.exports = mongoose.model("users", UserSchema);

