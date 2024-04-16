const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Shifts Schema
const ShiftsSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: "users",
        },

        // shiftName: {
        //     type: String,
        //     required: [true, "Every shift must have a shift name!"]
        // },

        startDate: {
            type: String,
            required: [true, "Every shift must have a start date."],
        },

        startHour: {
            type: String,
            required: [true, "Every shift must have a start hour."],
        },

        endDate: {
            type: String,
            required: [true, "Every shift must have an end date."],
        },

        endHour: {
            type: String,
            required: [true, "Every  shift must have an end hour."],
        },

        pricePerHour: {
            type: Number,
            required: [true, "Every shift must have a price per hour."],
        },

        place: {
            type: String,
            enum: ["Remote", "On-site"],
            required: [true, "Every shift must have a place."],
        },

        hoursWorked: {
            type: Number,
            default: 0,
        },

        payPerShift: {
            type: Number,
            default: 0,
        },

        created: {
            type: Date,
            default: Date.now(),
        },

        updated: {
            type: Date,
        },
    },
    {
        toJSON: { virtuals: true, getters: true },
        toObject: { virtuals: true },
    }
);

ShiftsSchema.virtual('user', {
    ref: 'users',
    localField: '_id',
    foreignField: 'userId',
    justOne: true,
});

ShiftsSchema.virtual('comment', {
    ref: 'comments',
    localField: '_id',
    foreignField: 'shiftId'
})

// ShiftsSchema.pre('save', async function (next) {
//     const existingShift = await this.constructor.findOne({
//         userId: this.userId,
//         shiftName: this.shiftName,
//     });

//     if (existingShift) {
//         const error = new Error("This shift name already exists for the user.");
//         next(error);
//     } else {
//         next();
//     }
// });

ShiftsSchema.pre('save', function(next){
    const start = new Date(
        `${this.startDate}T${this.startHour}`
      );
      const end = new Date(
        `${this.endDate}T${this.endHour}`
      );

      if (start >= end) {
        return next(new Error('Start date and time must be before end date and time.'));
      }

    if(!this.hoursWorked){
        this.hoursWorked = this.calculateHoursWorked();
    }

    if(!this.payPerShift){
        this.payPerShift = this.calculatePayPerShift();
    }

    next();
})


ShiftsSchema.methods.calculateHoursWorked = function () {
    const start = new Date(`${this.startDate}T${this.startHour}`);
    const end = new Date(`${this.endDate}T${this.endHour}`);
    const diffInMilliseconds = end - start;
    const hoursWorked = diffInMilliseconds / (1000 * 60 * 60);
    return isNaN(hoursWorked.toFixed(0)) ? 0 : hoursWorked.toFixed(0);
};

ShiftsSchema.methods.calculatePayPerShift = function () {
    return this.hoursWorked * this.pricePerHour;
};

module.exports = mongoose.model("shifts", ShiftsSchema);


