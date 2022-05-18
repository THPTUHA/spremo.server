import { Router } from 'express';
import follow from './follow';
import unfollow from './unfollow';

export default (app: Router) => {
    const route = Router();
    app.use("/relationship",route);
    follow(route);
    unfollow(route);
};