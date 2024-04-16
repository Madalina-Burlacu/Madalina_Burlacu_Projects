const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
    },

    shiftId: {
        type: mongoose.Schema.ObjectId,
        ref: "shifts",
    },

    description: {
        type: String,
        required: [true, 'Please provide a description.'],
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
    }
})

CommentsSchema.virtual('shift', {
    ref: 'shifts',
    localField: 'shiftsId',
    foreignField:'_id',
    justOne: true
});

CommentsSchema.virtual('user', {
    ref: 'users',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
})

module.exports = mongoose.model( "comments", CommentsSchema );