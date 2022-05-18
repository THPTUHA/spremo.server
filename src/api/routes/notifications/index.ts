import { Router } from 'express';
import list from './list';
import unseenGet from './unseen.get';

export default (app: Router) => {
    const route = Router();
    app.use("/notification",route);
    unseenGet(route);
    list(route);
};