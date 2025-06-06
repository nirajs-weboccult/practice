let mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let usersSchema = new mongoose.Schema(
    {
        role_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'roles',
            required: true,
            index: true
        },
        first_name: {
            type: String,
            trim: true,
            required: true,
        },
        last_name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Both", "Not Selected"],
            index: true,
            default: "Not Selected"
        },
        is_active:{
            type: Number,
            enum: [0, 1],  // 0 => Not activated; 1 => Activated;
            default: 0,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('users', usersSchema);
