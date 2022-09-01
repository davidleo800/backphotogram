import { Request, Response, Router } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt'
import Token from '../classes/token';
import { verifyToken } from '../middlewares/authentication';


const userRoutes = Router();

// Login
userRoutes.post('/login', (req: Request, res: Response) => {

    const body = req.body

    User.findOne({ email: body.email }, (err: any, userDB: any) => {

        if ( err ) throw err;

        if( !userDB ){

            return res.json({
                state: false,
                message: 'User/Password are invalid'
            });
            
        }

        if ( userDB.comparePassword( body.password ) ) {

            const tokenUser = Token.getJwtToken({
                _id:  userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                state: true,
                token: tokenUser
            });

        } else {

            return res.json({
                state: false,
                message: 'User/Password are invalid'
            });

        }

    })

});


// Create User
userRoutes.post('/create', (req: Request, res: Response) => {

    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    }

    User.create( user ).then( userDB =>  {

        const tokenUser = Token.getJwtToken({
            _id:  userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            state: true,
            token: tokenUser
        });

    }).catch( err => {
        res.json({
            state: false,
            err
        });
    })

});


// Update User
userRoutes.post('/update', verifyToken, (req: any, res: Response) => {

    const user = {

        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        avatar: req.body.avatar || req.user.avatar

    }

    User.findByIdAndUpdate( req.user._id, user, { new: true }, ( err, userDB ) => {

        if ( err ) throw err;

        if ( !userDB ) {

            return res.json({
                state: false,
                message: 'There is no user with that id'
            });

        }

        const tokenUser = Token.getJwtToken({
            _id:  userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });

        //res.json({
        //    state: true,
        //    token: tokenUser
        //});

        res.json({
            state: true,
            user: req.user
        });

    });



});

userRoutes.get('/', [ verifyToken ], (req: any, res: Response) => {

    const user = req.user;

    res.json({
        state: true,
        user
    });

});

export default userRoutes;