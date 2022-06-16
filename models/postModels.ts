import mongoose, {Schema} from "mongoose";

const postSchema = new Schema({
    idUser: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: Date, required: true},
    comments: {type: Array, required: true, default: []},
    likes: {type: Array, required: true, default: []}
});

export const postModels = (mongoose.models.posts || mongoose.model('posts', postSchema));