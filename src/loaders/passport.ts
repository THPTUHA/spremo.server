import passport from 'passport'
import LocalStrategy from 'passport-local';
import JWTStrategy from 'passport-jwt';
import { UserModel } from '../models/user/user';
import { Application } from 'express';

import BaseError from '../packages/base.error/BaseError';

export default ({ app }: {app: Application}) => {
    passport.use('signin', new LocalStrategy.Strategy(async function (username, password, done) {
        let user = await UserModel.findOne({
            where: {username: username}
        });

        if (!user) {
            user = await UserModel.findOne({
                where: {email: username.replace(/\s/g, '')}
            });
        }
    
        if (!user) {
            return done(null, false, {message: BaseError.Code.INVALID_AUTH.toString()});
        } 
        
        var user_obj:any = user.toJSON();
        if (!UserModel.checkCorrectPassword(user_obj.username, password, user_obj.password)) {
            return done(null, false, {message: BaseError.Code.INVALID_PASSWORD.toString()});
        }

        if(!user.isActiveAccount()){
            return done(null, false, {message: BaseError.Code.INACTIVATE_AUTH.toString()})
        }
        
        return done(null, user_obj, {message: BaseError.Code.SUCCESS.toString()});
        
    }));

    passport.use(new JWTStrategy.Strategy({
        secretOrKey: process.env.JWT_ENCODE_USER_KEY,
        jwtFromRequest: JWTStrategy.ExtractJwt.fromBodyField('access_token')
    }, async (token, done) => {
        const user = await UserModel.findByPk(token.user.id);
        return done(null, user);
    }));

    passport.serializeUser(function(user: any, done) {
        done(null, user.id);
    });


    app.use(passport.initialize());
    app.use(passport.session());
}