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
exports.setTokenById = exports.getTokenById = exports.Logout = exports.Login = exports.DeleteUser = exports.UpdatePassword = exports.UpdateAccount = exports.UpdateUser = exports.StoreNewUser = exports.GetUserByTokenId = exports.GetUserById = exports.GetAllUsers = void 0;
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const filtering_1 = require("../utils/filtering");
const jwt_helper_1 = require("../services/jwt.helper");
const PASSWORD_SALT = 10;
const DEFAULT_PASSWORD = "1234abcd";
const INPUT_TYPES_USUARIOS = ['nombres', 'correo', 'username', 'password', 'rol_id'];
const OUTPUT_TYPES_USUARIOS = ['id', 'nombres', 'correo', 'username', 'rol', 'activo', 'createdAt', 'updateAt'];
const SUPER_USER = {
    username: "nautilus",
    password: "@AvadaKedavra1993"
};
const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordValue = password !== null && password !== void 0 ? password : DEFAULT_PASSWORD;
    let hashedPassword = passwordValue;
    return bcrypt_1.default
        .genSalt(PASSWORD_SALT)
        .then((salt) => __awaiter(void 0, void 0, void 0, function* () {
        return bcrypt_1.default.hash(passwordValue, salt);
    }))
        .then(hashed => hashed)
        .catch(err => {
        console.error(err.message);
        return hashedPassword;
    });
});
exports.GetAllUsers = ((_req, res) => {
    (0, user_model_1.GetAll)().then((users => {
        const data = users.map((user) => {
            return (0, filtering_1.ObjectFiltering)(user, OUTPUT_TYPES_USUARIOS);
        });
        res.send({ success: true, data });
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(404).send({ error: error.message });
    }));
});
// How to convert string to number in typescript?       
exports.GetUserById = ((req, res) => {
    const id = Number(req.params.id);
    (0, user_model_1.GetById)(id).then((user => {
        const data = (0, filtering_1.ObjectFiltering)(user, OUTPUT_TYPES_USUARIOS);
        res.send({ success: true, data });
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(404).send({ error: error.message });
    }));
});
// How to convert string to number in typescript?       
exports.GetUserByTokenId = ((id, res) => {
    (0, user_model_1.GetById)(id).then((user => {
        const data = (0, filtering_1.ObjectFiltering)(user, OUTPUT_TYPES_USUARIOS);
        res.send({ success: true, data });
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(404).send({ error: error.message });
    }));
});
exports.StoreNewUser = ((req, res) => {
    var _a;
    const data = req.body;
    if ((0, filtering_1.ObjectDifferences)(data, INPUT_TYPES_USUARIOS).length > 0) {
        return res.status(400).json({ message: 'Incorrect or incomplete data in request', valid: INPUT_TYPES_USUARIOS });
    }
    encryptPassword((_a = data.password) !== null && _a !== void 0 ? _a : null).then((password) => {
        data.password = password;
        (0, user_model_1.Store)(data).then((newUser => {
            const data = (0, filtering_1.ObjectFiltering)(newUser, OUTPUT_TYPES_USUARIOS);
            return res.send({ message: 'User created successfully!', data });
        })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
            if (error.code === 'P2000')
                return res.status(400).send({ error: 'A field is too longer.', message: error.message });
            if (error.code === 'P2002')
                return res.status(400).send({ error: 'Same user data already registred.', message: error.message });
            return res.status(400).send({ error: error.message });
        }));
    });
    return;
});
exports.UpdateUser = ((req, res) => {
    const id = Number(req.params.id);
    const bodyData = req.body;
    (0, user_model_1.Update)(id, bodyData).then((updateUser => {
        const data = (0, filtering_1.ObjectFiltering)(updateUser, OUTPUT_TYPES_USUARIOS);
        return res.send({ success: true, data });
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        return res.status(400).send({ error: error.message });
    }));
});
exports.UpdateAccount = ((req, res) => {
    const id = Number(res.locals.payload.id);
    const bodyData = req.body;
    if (res.locals.payload.type === "super") {
        res.status(403).json({ message: "Cannont change super user data." });
        return;
    }
    (0, user_model_1.Update)(id, bodyData).then((updateUser => {
        const data = (0, filtering_1.ObjectFiltering)(updateUser, OUTPUT_TYPES_USUARIOS);
        return res.send({ success: true, data });
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        return res.status(400).send({ error: error.message });
    }));
});
exports.UpdatePassword = ((req, res) => {
    var _a, _b;
    const id = Number((_a = req.params.id) !== null && _a !== void 0 ? _a : res.locals.payload.id);
    if (id === 0) {
        res.status(403).json({ message: "Cannont change super user data." });
        return;
    }
    encryptPassword((_b = req.body.password) !== null && _b !== void 0 ? _b : null).then((password) => {
        (0, user_model_1.Update)(id, { password }).then((_user => {
            return res.send({ success: true });
        })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
            res.status(400).send({ error: error.message });
        }));
    });
});
exports.DeleteUser = ((req, res) => {
    const id = Number(req.params.id);
    (0, user_model_1.Delete)(id).then((result) => {
        console.log(result);
        return res.json({ success: true });
    }).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(400).send({ error: error.message });
    }));
});
exports.Login = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (body === undefined)
        return res.sendStatus(400);
    const { username, password } = body;
    if (!username || !password)
        return res.status(400).json({ message: 'username or password forbiden' });
    // Verify superUser Credencials
    if (username === SUPER_USER.username && password === SUPER_USER.password) {
        const token = (0, jwt_helper_1.createToken)({ type: "super", id: 0, username, correo: "super@user.com" });
        return res.json({ token });
    }
    yield (0, user_model_1.GetBy)({ username })
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        const isEqual = bcrypt_1.default.compareSync(password, user.password);
        if (isEqual) {
            const filterUser = (0, filtering_1.ObjectFiltering)(user, ['id', 'username', 'correo']);
            const token = (0, jwt_helper_1.createToken)(Object.assign({ type: "user" }, filterUser));
            yield (0, user_model_1.Update)(user.id, { token });
            return res.json({ token });
        }
        return res.status(400).json({ message: 'username or password not match' });
    }))
        .catch((error) => {
        console.error({ error });
        return res.status(400).json({ message: 'username or password not match', errorcode: error.code });
    });
    return res.status(400);
}));
exports.Logout = ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = res.locals.payload.id;
    if (id > 0) {
        yield (0, user_model_1.Update)(id, { token: "" }).then((_data => {
            return res.status(200).json({ message: 'you are logged out' });
        })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
            return res.status(400).send({ error: error.message });
        }));
    }
}));
exports.getTokenById = ((id) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, user_model_1.GetById)(id).then((user) => {
        if (!user.activo)
            return null;
        return user.token;
    }).catch((error) => {
        console.error(error);
        return null;
    });
    return token !== null && token !== void 0 ? token : null;
}));
exports.setTokenById = ((id, token) => {
    (0, user_model_1.Update)(id, { token }).then((_user) => {
        return true;
    }).catch((error) => {
        console.error(error);
        return false;
    });
    return false;
});
