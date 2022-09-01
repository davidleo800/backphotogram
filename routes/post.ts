import { Router, Response } from "express";
import { FileUpload } from "../interfaces/file-upload";
import { verifyToken } from "../middlewares/authentication";
import { Post } from '../models/post.model';
import FileSystem from '../classes/file-system';
import { User } from '../models/user.model';


const postRoutes = Router();
const fileSystem = new FileSystem();

// Get Post paginated
postRoutes.get('/', [ verifyToken ], async (req: any, res: Response) => {

    let page = Number(req.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;

    const posts = await Post
    .find()
    .sort({ _id: -1 })
    .skip( skip )
    .limit(10)
    .populate('user', '-password')
    .exec();

    res.json({
        state: true,
        page,
        posts
    });

});


// Create Post
postRoutes.post('/', [ verifyToken ], (req: any, res: Response) => {

    const body = req.body;
    body.user = req.user._id;

    const images = fileSystem.imagesFromTemptoPost( req.user._id );
    body.imgs = images;

    Post.create( body ).then( async postDB => {

        await postDB.populate('user', '-password');

        res.json({
            state: true,
            post: postDB
        });

    }).catch( err => {
        res.json( err );
    });



});

// Service to file upload
postRoutes.post('/upload', [ verifyToken ], async (req: any, res: Response) => {

    if ( !req.files ){

        return res.status(400).json({
            state: false,
            message: 'No file uploaded'
        });

    }

    const file: FileUpload = req.files.image;

    if ( !file ) {

        return res.status(400).json({
            state: false,
            message: 'No image file uploaded, bad request'
        });

    }

    if ( !file.mimetype.includes('image' )) {

        return res.status(400).json({
            state: false,
            message: 'Uploaded file is not an image'
        });

    }

    await fileSystem.SaveTemporaryImage( file, req.user._id );

    res.json({
        state: true,
        message: 'file uploaded',
        file: file.mimetype
    });

});

postRoutes.get('/image/:userid/:img', (req: any, res: Response) => {

    const userId = req.params.userid;
    const img = req.params.img;

    const pathPhoto = fileSystem.getPhotoUrl( userId, img);

    res.sendFile( pathPhoto, img );

});


export default postRoutes;