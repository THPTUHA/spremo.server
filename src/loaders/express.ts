import express from 'express';
import routes from '../api';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

export default ({ app }: { app: express.Application }) => {
    console.log("load;ing")
    app.use(cors(
        {
            'origin': '*',
            'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        }
    ));
    app.use(morgan('combined'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(session({
        secret: 'gagoda_secret',
        resave: false,
        saveUninitialized: false
    }));

    app.use('/api', routes());
};