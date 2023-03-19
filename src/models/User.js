const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        ref: "Role",
        type: mongoose.Schema.Types.ObjectId
        
    }]
}, {
    timestamps: true,
    versionKey: false
});

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

userSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword)
}


module.exports = mongoose.model("Usuario", userSchema);