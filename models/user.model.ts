import { Schema, model, Document } from "mongoose";
import bcrypt from 'bcrypt';


const userSchema = new Schema({

    name: {
        type: String,
        required: [ true, 'Name required' ]
    },

    avatar: {
        type: String,
        default: 'av-1.png'
    },

    email: {
        type: String,
        unique: true,
        required: [ true, 'Email required' ]
    },

    password: {
        type: String,
        required: [ true, 'Password required' ]
    }

});

userSchema.method('comparePassword', function( password: string=''): boolean {

    if( bcrypt.compareSync( password, this.password ) ){

        return true;

    } else {

        return false;

    }

});

interface IUser extends Document {

    name: string;
    email: string;
    password: string;
    avatar: string;

    comparePassword(password: string): boolean;
}

export const User = model<IUser>('User', userSchema);