let mongoose = require('mongoose');
let rolesSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true
        },
        access_module: {
            type: Array,
            default: [],
            index: true
        },
        is_active: {
            type: Number,
            enum: [0, 1],  // 0 => Inactive; 1 => Active;
            default: 1,
            index: true
        },
        deletedAt: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model('roles', rolesSchema);
