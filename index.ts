import mongoose from 'mongoose';

import cors from 'cors';

import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload'

import postRoutes from './routes/post';
import Server from './classes/server';
import userRoutes from './routes/user';


const server = new Server();

// Body parser
server.app.use( bodyParser.urlencoded({ extended: true }) );
server.app.use( bodyParser.json() );

// FileUpload
server.app.use( fileUpload() );

// Config CORS
server.app.use( cors({ origin: true, credentials: true }) );

// Application Routes
server.app.use( '/user', userRoutes );
server.app.use( '/posts', postRoutes );

// DB Connect
mongoose.connect('mongodb://localhost:27017/fotosgram', 
                (err) => {
                    if(err) throw err;

                    console.log('DataBase Online');
                })


// Start express
server.start( () => {
    console.log(`Server running on port ${ server.port }`)
} )