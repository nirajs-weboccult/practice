let mongoose = require('mongoose');
// let commonFunction = require('../helpers/common-function');
const bcrypt = require('bcrypt');
let usersSchema = new mongoose.Schema(
    {
        // profile:{
        //     type: String,
        //     default: ''
        // },
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
            // trim: true,
            // lowercase: true,
            index: true
        },
        // status: {
        //     type: Number,
        //     enum: [0, 1, 2],  // 0 => Inactive; 1 => Active; 2 => Deleted
        //     default: 1,
        //     index: true
        // },
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
        // pronouns: {
        //     type: String,
        //     enum: ["He", "She", "They", "Not Selected"],
        //     index: true,
        //     default: "Not Selected"
        // },
        
        is_active:{
            type: Number,
            enum: [0, 1],  // 0 => Not activated; 1 => Activated;
            default: 0,
        },
        // deletedAt: { type: Date },
    },
    { timestamps: true }
);

usersSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        // console.log("While updated");
        user.password = await bcrypt.hash(user.password, 4);
    }
    next();
});

// function createHash(next) {
//     var user = this
//     if(user.email){
//         user.email = commonFunction.cipher(this.email);
//     }
//     if(user.mobile_number){
//         user.mobile_number = commonFunction.cipher(this.mobile_number);
//     }
//     if(user.name){
//         user.name = commonFunction.cipher(this.name);
//     }
//     if(this.address){
//         user.address = commonFunction.cipher(this.address);
//     }
//     next();
// }

// usersSchema.pre('save', createHash);
module.exports = mongoose.model('users', usersSchema);
