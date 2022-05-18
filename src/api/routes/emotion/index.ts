import { Router } from 'express';
import get from './get';
import update from './update';

export default (app: Router) => {
    const route = Router();
    app.use("/emotion",route);
    get(route);
    update(route);
    
};