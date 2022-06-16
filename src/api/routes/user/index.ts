import { Router } from 'express';
import censor from './censor';
import list from './list';
import profile from './profile';

export default (app: Router) => {
    const route = Router();
    app.use('/user',route);
    list(route);
    censor(route);
    profile(route);
};