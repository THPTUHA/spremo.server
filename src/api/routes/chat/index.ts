import { Router } from 'express';
import get from './get';
import list from './list';

export default (app: Router) => {
    const route = Router();
    app.use("/chat",route);
    get(route);
    list(route);
};