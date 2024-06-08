
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        city: {
            type: String,
            default: ""
        },
        district: {
            type: String,
            default: ""
        },
        ward: {
            type: String,
            default: ""
        },
        street: {
            type: String,
            default: ""
        }
    },
    avatar: {
        type: Object
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            default: []
        }
    ]
}, {
    timestamps: true
});

const User = mongoose.model("User", UserSchema);

export default User;