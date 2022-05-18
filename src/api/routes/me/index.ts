import { Router } from 'express';
import blogGet from './blog.get';
import profile from './profile';
import blogList from './blog.list';
import blogUpdate from './blog.update';
import blogCreate from './blog.create';
import blogDelete from './blog.delete';
import blogShare from './blog.share';
import appearanceEdit from './appearance.edit';
import record from './record';
import friendList from './friend.list';

export default (app: Router) => {
    const route = Router();
    app.use("/me",route);
    profile(route);
    blogGet(route);
    blogList(route);
    blogUpdate(route);
    blogCreate(route);
    blogDelete(route);
    blogShare(route);
    appearanceEdit(route);
    record(route);
    friendList(route);
};