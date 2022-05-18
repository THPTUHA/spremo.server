import { Router } from 'express';
import banBlog from './ban.blog';
import banUser from './ban.user';
import pickBlog from './pick.blog';
import promoteUser from './promote.user';
import unbanBlog from './unban.blog';
import unbanUser from './unban.user';
import unpickBlog from './unpick.blog';

export default (app: Router) => {
    const route = Router();
    app.use("/admin",route);
    banUser(route);
    unbanUser(route);
    promoteUser(route);
    pickBlog(route);
    unpickBlog(route);
    banBlog(route);
    unbanBlog(route);
};