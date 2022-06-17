import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    name: {type : String, required : true},
    email: {type : String, required : true},
    password: {type : String, required : true},
    avatar: {type : String, required : false},
    posts: {type :Number, default: 0},
    followers: {type : Number, default : 0},
    following: {type : Number, default : 0},
});

export const userModels = (mongoose.models.user || mongoose.model('user', userSchema));