import jwt, { decode } from 'jsonwebtoken';


export default class Token {


    private static seed: string = 'this-is-the-seed';
    private static expiration: string = '30d';

    constructor() { }

    static getJwtToken( payload: any ): string {

        return jwt.sign({
            user: payload
        }, this.seed, {expiresIn: this.expiration});
    }

    static checkToken( userToken: string) {

        return new Promise( (resolve, reject) => {

            jwt.verify( userToken, this.seed, ( err, decode ) => {

                if ( err ){
                    // Invalid token
                    reject();
                }else{
                    // Token ok
                    resolve(decode);
                }
            } )

        } )



    }

}