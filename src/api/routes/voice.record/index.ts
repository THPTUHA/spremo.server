import { Router } from 'express';
import create from './create';

export default (app: Router) => {
    const route = Router();
    app.use("/voice.record",route);
    create(route)
};