import { Router } from 'express';
import banBlog from './ban.blog';
import banUser from './ban.user';
import blogList from './blog.list';
import pickBlog from './pick.blog';
import promoteUser from './promote.user';

export default (app: Router) => {
    const route = Router();
    app.use("/admin",route);
    banUser(route);
    promoteUser(route);
    pickBlog(route);
    banBlog(route);
    blogList(route);
};