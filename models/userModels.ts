import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    user: {type : String, required : true},
    email: {type : String, required : true},
    password: {type : String, required : true},
    avatar: {type : String, required : false},
    posts: {type :Number, default: 0},
    followers: {type : Number, default : 0},
    followings: {type : Number, default : 0},
});

export const userModels = (mongoose.models.user || mongoose.model('user', userSchema));