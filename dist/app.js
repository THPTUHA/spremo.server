"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const loaders_1 = __importDefault(require("./loaders"));
const http_1 = require("http");
const socket_1 = __importDefault(require("./loaders/socket"));
dotenv_1.default.config({ path: '../.env' });
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const server = (0, http_1.createServer)(app);
        yield (0, loaders_1.default)({ expressApp: app });
        yield (0, socket_1.default)(server);
        // app.get("/", (req: any, res: any) => {
        //     res.sendFile(path.resolve("./src/index.html"));
        // });
        server.listen(process.env.PORT, () => {
            console.log(`server is listening ${process.env.NODE_ENV} on ${process.env.PORT}`);
        });
        server.setTimeout(3600 * 1000);
    });
}
startServer();
//# sourceMappingURL=app.js.map