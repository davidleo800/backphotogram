import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {

    constructor() { };

    SaveTemporaryImage( file: FileUpload, userId: string ) {

        return new Promise<void>( (resolve, reject) => {

       // create folders
        const path = this.CreateUserFolder( userId );


        // file name
        const fileName = this.generateUniqueName( file.name );
        
        // Move file temp to folder dist/uploads

        file.mv( `${ path }/${ fileName }`, (err: any) => {

            if ( err ){
                // not ok
                reject(err);
            } else {
                // its ok
                resolve();
            }

         });

    });


        

    }

    private generateUniqueName( originalName: string ) {

        //name.jpg
        const nameArr = originalName.split('.');
        const extension = nameArr[ nameArr.length -1 ];

        const uniqId = uniqid();

        return `${ uniqId }.${extension}`;

    }

    private CreateUserFolder( userId: string ) {

        const pathUser = path.resolve( __dirname, '../uploads', userId );
        const pathUserTemp = pathUser + '/temp';
        // console.log(pathUser);

        const exist = fs.existsSync( pathUser );

        if( !exist ) {

            fs.mkdirSync( pathUser );
            fs.mkdirSync( pathUserTemp );

        }

        return pathUserTemp;
    }

    imagesFromTemptoPost( userId: string ) {

        const pathTemp = path.resolve( __dirname, '../uploads/', userId, 'temp' );
        const pathPost = path.resolve( __dirname, '../uploads/', userId, 'posts' );
        
        if ( !fs.existsSync( pathTemp) ) {
            return [];
        }

        if ( !fs.existsSync( pathPost ) ) {
            fs.mkdirSync( pathPost );
        }

        const imagesTemp = this.getImagesTemp( userId );

        imagesTemp.forEach( image => {
            fs.renameSync( `${ pathTemp }/${ image }`, `${ pathPost }/${ image }` );
        });

        return imagesTemp;

    }

    private getImagesTemp ( userId: string ) {

        const pathTemp = path.resolve( __dirname, '../uploads', userId, 'temp' );

        return fs.readdirSync( pathTemp ) || [];

    }

    getPhotoUrl( userId: string, img: string ){

        // Path POSTs
        const pathPhoto = path.resolve( __dirname, '../uploads', userId, 'posts', img );

        const exist = fs.existsSync( pathPhoto );

        if(!exist) {
            return path.resolve( __dirname, '../../assets/400x250.jpg');
        }

        return pathPhoto;

    }

}