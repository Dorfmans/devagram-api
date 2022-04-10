import multer from "multer";
import cosmicjs from 'cosmicjs';

const {
    AVATAR_SLUG,
    AVATAR_WRITE_KEY,
    FEED_SLUG,
    FEED_WRITE_KEY} = process.env;

const Cosmic = cosmicjs();
const avatarBucket = Cosmic.bucket({
    slug: AVATAR_SLUG,
    write_key: AVATAR_WRITE_KEY
});
const feedBucket = Cosmic.bucket({
    slug: FEED_SLUG,
    write_key: FEED_WRITE_KEY
});

const storage = multer.memoryStorage();
const upload = multer({storage : storage});

const cosmicImageUploader =async (req: any) => {
    if(req?.file?.originalname){

        if(!req.file.originalname.includes('.png')
            && !req.file.originalname.includes('.jpg')
            && !req.file.originalname.includes('.jpeg')
            && !req.file.originalname.includes('.svg')
        ){
            throw new Error('Invalid File');
        }
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer
        };
        
        if(req.url && req.url.includes('feed')){
            return await feedBucket.addMedia({media: media_object});
        }else{
            return await avatarBucket.addMedia({media: media_object});
        }
    }   
}

export {upload, cosmicImageUploader};