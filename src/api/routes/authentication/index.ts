import { Router } from 'express';
import signup from './signup';
import verify from './verify';
import sigin from './signin';
import signout from './signout';

export default (app: Router) => {
    const route = Router();
    app.use("/authentication",route);
    signup(route);
    verify(route);
    sigin(route);
    signout(route);
};