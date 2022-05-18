import { Router } from 'express';
import update from './update';

export default (app: Router) => {
    const route = Router();
    app.use("/draw",route);
    update(route);
    
};