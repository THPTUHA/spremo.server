import { Router } from 'express';
import authList from './auth.list';
import authSimilar from './auth.similar';
import commentAdd from './comment.add';
import create from './create';
import detail from './detail';
import edit from './edit';
import like from './like';
import list from './list';
import mark from './mark';
import profile from './profile';
import similar from './similar';
import userList from './user.list';

export default (app: Router) => {
    const route = Router();
    app.use("/blog",route);
    create(route);
    commentAdd(route);
    like(route);
    list(route);
    profile(route);
    detail(route);
    edit(route);
    mark(route);
    authList(route);
    userList(route);
    similar(route);
    authSimilar(route);
};