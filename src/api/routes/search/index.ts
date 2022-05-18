import { Router } from 'express';
import hint from './hint';


export default (app: Router) => {
    const route = Router();
    app.use("/search",route);
    hint(route);
};