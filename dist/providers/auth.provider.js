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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = exports.ResetPassword = exports.UpdatePassword = exports.UpdateAccount = exports.GetAccount = exports.Logout = exports.Login = exports.verifyUserName = exports.ConfirmPasswordForm = exports.LoginForm = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_helper_1 = require("../services/jwt.helper");
const filtering_1 = require("../utils/filtering");
const zod_1 = require("zod");
const user_schema_1 = require("../schemas/user.schema");
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient;
const DEFAULT_PASSWORD = (_a = process.env.DEFAULT_PASSWORD) !== null && _a !== void 0 ? _a : "%-d3fP4$$w0rd";
const LoginForm = (_req, res) => {
    const pathfile = path_1.default.join(path_1.default.resolve('./'), '/src/pages/loginForm.html');
    console.log(pathfile);
    res.sendFile(pathfile);
};
exports.LoginForm = LoginForm;
const ConfirmPasswordForm = (_req, res) => {
    const pathfile = path_1.default.join(path_1.default.resolve('./'), '/src/pages/resetPasswordForm.html');
    return res.sendFile(pathfile);
};
exports.ConfirmPasswordForm = ConfirmPasswordForm;
const verifyUserName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        yield prisma.$connect();
        const _b = yield checkUserAccount(body.username), { data: user } = _b, result = __rest(_b, ["data"]);
        if (user === undefined) {
            return res.status(result.code).json(Object.assign({}, result));
        }
        const token = (0, jwt_helper_1.createToken)({
            id: user.id,
            type: 'USER',
            username: user.username,
            correo: user.correo
        });
        if (bcrypt_1.default.compareSync(DEFAULT_PASSWORD, user.password)) {
            return res.status(203).json({ sucess: true, message: `Redirect to update password form`, data: token });
        }
        return res.json({ sucess: true, message: `User ${body.username} confirmed!` });
    }
    catch (error) {
        console.error(`Error trying check account of username: ${body.username}`, { error });
        return res.status(500).json({ success: false, message: `Error trying check account of username: ${body.username}`, data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.verifyUserName = verifyUserName;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const superLogin = getSuperUserLogin(body);
        if (superLogin !== null) {
            return (superLogin.success) ? res.json(superLogin) : res.status(400).json(superLogin);
        }
        yield prisma.$connect();
        const _c = yield checkUserAccount(body.username), { data: user } = _c, result = __rest(_c, ["data"]);
        if (user === undefined) {
            return res.status(result.code).json(Object.assign({}, result));
        }
        /*
        if (bcrypt.compareSync(DEFAULT_PASSWORD, user.password)) {
            return res.redirect(req.baseUrl + '/reset-password' + '?token=' + token)
        }
        */
        if (bcrypt_1.default.compareSync(body.password, user.password)) {
            const token = (0, jwt_helper_1.createToken)({
                id: user.id,
                type: 'USER',
                username: user.username,
                correo: user.correo
            });
            yield prisma.usuarios.update({
                where: { id: user.id },
                data: { token }
            });
            return res.json({ success: true, data: token });
        }
        return res.status(400).json({ success: false, message: 'Username or Password not match' });
    }
    catch (error) {
        console.error(`Error trying to login with username: ${body.username}`, { error });
        return res.status(500).json({ success: false, message: `Error trying to login with username: ${body.username}`, data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.Login = Login;
const Logout = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(res.locals.payload.id);
    try {
        if (id === 0) {
            return res.json({ success: true, message: "SuperUser logout successfully!" });
        }
        yield prisma.usuarios.update({
            where: { id },
            data: { token: null }
        });
        res.locals.payload = null;
        return res.json({ success: true, message: "You are logged out!" });
    }
    catch (error) {
        console.error(`Error trying logging out user id: ${id}`, { error });
        return res.status(500).json({ success: false, message: `Error trying logging out user id: ${id}`, data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.Logout = Logout;
const GetAccount = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(res.locals.payload.id);
    try {
        if (res.locals.payload.type === "super") {
            const data = getSuperUserData();
            if (data === null) {
                return res.status(500).json({ message: "Super user data cant be recovery, check envirounment constants for SUPER_USER" });
            }
            return res.json({ message: "Super user data recovery successfully", data });
        }
        const user = yield prisma.usuarios.findFirst({
            where: { id }
        });
        if (user === null) {
            return res.status(404).json({ success: false, message: 'User data not found' });
        }
        if (user.activo === false) {
            return res.status(404).json({ success: false, message: 'El usuario no esa activo, hable con su administrador' });
        }
        return res.json({ success: true, message: "User data recovery successfully", data: user });
    }
    catch (error) {
        console.error(`Error trying get account data for user id: ${id}`, { error });
        return res.status(500).json({ success: false, message: `Error trying get account data for user id: ${id}`, data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.GetAccount = GetAccount;
const UpdateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(res.locals.payload.id);
    const data = req.body;
    try {
        if (res.locals.payload.type === "super") {
            return res.status(403).json({ message: "Cannont change super user data." });
        }
        const result = yield prisma.usuarios.update({
            where: {
                id,
                activo: true
            },
            data: Object.assign(Object.assign({}, data), { agentes: undefined }),
            select: {
                nombres: true, username: true, correo: true, updatedAt: true
            }
        });
        return res.json({ success: true, message: 'User data was update successfully', data: result });
    }
    catch (error) {
        console.error(`Error trying update user data with id: ${id}`, { error });
        return res.status(500).json({ success: false, message: `Error trying update user data with id: ${id}`, data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.UpdateAccount = UpdateAccount;
const UpdatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(res.locals.payload.id);
    const data = req.body;
    try {
        const currVal = credentialsValidation({ password: data.current });
        if (currVal.success === false) {
            return res.status(400).json(currVal);
        }
        const newVal = credentialsValidation({ password: data.new, passwordCheck: data.confirm });
        if (newVal.success === false) {
            return res.status(400).json(newVal);
        }
        yield prisma.$connect();
        const user = yield prisma.usuarios.findFirst({
            where: { id }
        });
        if (user === null) {
            return res.status(404).json({ success: false, message: `Username with id: ${id} not found` });
        }
        if (user.activo === false) {
            return res.status(400).json({ success: false, message: 'El usuario no esa activo, hable con su administrador' });
        }
        if (bcrypt_1.default.compareSync(data.current, user.password)) {
            const password = yield (0, filtering_1.encryptPassword)(data.new);
            yield prisma.usuarios.update({
                where: { id }, data: { password }
            });
            return res.json({ success: true, message: `Passsword for User id ${id} was update successfully!`, data: true });
        }
        return res.status(400).json({ success: false, message: 'Current password not match' });
    }
    catch (error) {
        console.error(`Error trying update user password with id: ${id}`, { error });
        return res.status(500).json({ success: false, message: `Error trying update user password with id: ${id}`, data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.UpdatePassword = UpdatePassword;
const ResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        yield prisma.$connect();
        const user = yield prisma.usuarios.findFirst({
            where: { id }
        });
        if (user === null) {
            return res.status(404).json({ success: false, message: `Username with id: ${id} not found` });
        }
        const password = yield (0, filtering_1.encryptPassword)(DEFAULT_PASSWORD);
        yield prisma.usuarios.update({
            where: { id }, data: { password }
        });
        return res.json({ success: true, message: `Passsword for User id ${id} was reset to default successfully!`, data: true });
    }
    catch (error) {
        console.error(`Error trying reset user password with id: ${id}`, { error });
        return res.status(500).json({ success: false, message: `Error trying reset user password with id: ${id}`, data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.ResetPassword = ResetPassword;
const RefreshToken = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = res.locals.payload;
    try {
        const token = (0, jwt_helper_1.createToken)(payload);
        if (payload.type === 'USER') {
            yield prisma.usuarios.update({
                where: { id: payload.id },
                data: { token }
            });
        }
        return res.json({ success: true, data: token });
    }
    catch (error) {
        console.error(`Error trying refresh token to user: ${payload.username}`, { error });
        return res.status(500).json({ success: false, message: `Error trying refresh token to user: ${payload.username}`, data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.RefreshToken = RefreshToken;
const checkUserAccount = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.usuarios.findFirst({
        where: { username: { equals: username, mode: 'insensitive' } }
    });
    if (user === null) {
        return {
            code: 400,
            success: false,
            message: 'Username or Password not match'
        };
    }
    if (user.activo === false) {
        return {
            code: 404,
            success: false,
            message: `User ${username} is not active, comunicate with administrator`
        };
    }
    return {
        code: 200,
        success: true,
        message: `User ${username} is successfully getted`,
        data: user
    };
});
const getSuperUserData = () => {
    var _a, _b;
    const data = (_a = process.env.SUPER_USER) === null || _a === void 0 ? void 0 : _a.split(":");
    if (data === undefined)
        return null;
    const id = 0;
    const type = 'SUPER';
    const username = data[0];
    const password = data[1];
    const correo = (_b = data[2]) !== null && _b !== void 0 ? _b : undefined;
    return { id, type, username, password, correo };
};
const getSuperUserLogin = (credentials) => {
    const superUser = getSuperUserData();
    if (superUser === null) {
        return {
            success: false,
            message: "Super user data not found, check environment data for SUPER_USER"
        };
    }
    const { id, type, username, password, correo } = superUser;
    if (username !== credentials.username) {
        return null;
    }
    const validacion = credentialsValidation({ username, password, correo });
    if (validacion.success === false) {
        console.error({ validations: validacion.data });
        return validacion;
    }
    if (username.toLowerCase() === credentials.username.toLowerCase()
        && password === credentials.password) {
        return {
            success: true,
            message: 'Super User login successfully!',
            data: {
                id,
                username,
                correo,
                type,
                token: (0, jwt_helper_1.createToken)({ id, type, username, correo })
            }
        };
    }
    return {
        success: false,
        message: 'Super User login incorrect!'
    };
};
const credentialsValidation = ({ username, password, passwordCheck, correo }) => {
    try {
        user_schema_1.userSchema.pick({
            correo: true,
            username: true,
            password: true,
        }).optional()
            .parse({
            username,
            password,
            passwordCheck,
            correo
        });
        return {
            success: true
        };
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const data = error.issues.map((issue, _, errors) => {
                return {
                    key: issue.path.join(" > "),
                    messages: errors.filter(error => error.path === issue.path)
                        .map(error => error.message)
                };
            });
            return {
                success: false,
                message: `Validation error on credentials`,
                data
            };
        }
        return {
            success: false
        };
    }
};
