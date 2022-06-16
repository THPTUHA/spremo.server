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
const express_1 = __importDefault(require("../loaders/express"));
const schema_1 = __importDefault(require("../loaders/schema"));
const passport_1 = __importDefault(require("../loaders/passport"));
const Mailer_1 = __importDefault(require("../packages/mailer/Mailer"));
const mongo_1 = __importDefault(require("../loaders/mongo"));
exports.default = ({ expressApp }) => __awaiter(void 0, void 0, void 0, function* () {
    yield Mailer_1.default.init();
    try {
        yield (0, schema_1.default)();
        yield (0, mongo_1.default)();
    }
    catch (err) {
        console.log(err.message);
    }
    yield (0, express_1.default)({ app: expressApp });
    yield (0, passport_1.default)({ app: expressApp });
});
//# sourceMappingURL=index.js.map