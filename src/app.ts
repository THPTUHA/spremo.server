import express from 'express';
import dotenv from 'dotenv';
import loaders from './loaders';
import {createServer} from "http";
import {Server} from "socket.io";
import * as path from "path";
import socketioJwt from 'socketio-jwt';
import { UserModel } from './models/user/user';
import socketLoader from './loaders/socket';

dotenv.config({ path: '../.env' });

async function startServer() {
    const app = express();
    const server = createServer(app);

    await loaders({ expressApp: app });
    await socketLoader(server)
    // app.get("/", (req: any, res: any) => {
    //     res.sendFile(path.resolve("./src/index.html"));
    // });

    server.listen(process.env.PORT, () => {
        console.log(`server is listening ${process.env.NODE_ENV} on ${process.env.PORT}`);
    });

    server.setTimeout(3600 * 1000);
}

startServer();