import { Router } from 'express';
import censor from './censor';
import list from './list';
import top from './top';

export default (app: Router) => {
    const route = Router();
    app.use('/user',route);
    top(route);
    list(route);
    censor(route);
};