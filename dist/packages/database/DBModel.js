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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
class DBModel extends sequelize_typescript_1.Model {
    static saveObject(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var value = yield this.create(params);
            //@ts-ignore
            value.id = value.null;
            //@ts-ignore
            return value;
        });
    }
    static paginate(query, { page, page_size }) {
        return __awaiter(this, void 0, void 0, function* () {
            var value = yield this.findAll(Object.assign(Object.assign({}, query), { offset: (page - 1) * page_size, limit: page_size }));
            return value;
        });
    }
    static findAllSafe(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var where = options.where;
            var keys = Object.keys(where);
            for (var i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (!where[key].length) {
                    return [];
                }
                if (where[key][sequelize_1.Op.or] && !where[key][sequelize_1.Op.or].length) {
                    return [];
                }
            }
            //@ts-ignore
            return this.findAll(options);
        });
    }
    saveObject() {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore;
            return yield DBModel.saveObject(this);
        });
    }
    edit(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.save({ fields: fields });
        });
    }
}
exports.DBModel = DBModel;
//# sourceMappingURL=DBModel.js.map