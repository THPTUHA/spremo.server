import { Router } from 'express';
import audio from './audio';
import img from './img';

export default (app: Router) => {
    const route = Router();
    app.use('/upload',route);
    img(route);
    audio(route);
};