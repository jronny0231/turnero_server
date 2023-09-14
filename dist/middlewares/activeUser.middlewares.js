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
exports.validateActiveUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const verbConversion = {
    GET: "read",
    POST: "create",
    PUT: "update",
    DELETE: "delete",
};
const validateActiveUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = (_a = res.locals.token) !== null && _a !== void 0 ? _a : null;
    const payload = (_b = res.locals.payload) !== null && _b !== void 0 ? _b : null;
    // Verify is token is valid
    if (token === null || payload === null) {
        return res.status(403).json({ success: false, message: "Token forbidden!" });
    }
    // Valid if user data in token is super user offline account and return next to continue
    if (payload.type === 'SUPER') {
        return next();
    }
    // Verify asynchronously if online user account has same token stored.
    try {
        yield prisma.$connect();
        const userAndPermissions = yield prisma.usuarios.findFirst({
            where: { id: payload.id },
            include: {
                rol: {
                    include: {
                        roles_permisos: {
                            include: {
                                permiso: true
                            }
                        }
                    }
                }
            }
        });
        if (userAndPermissions === null) {
            res.locals.token = null;
            res.locals.payload = null;
            return res.status(404).json({ success: false, message: "User logged not found!" });
        }
        if (userAndPermissions.activo === false) {
            res.locals.token = null;
            res.locals.payload = null;
            return res.status(400).json({ success: false, message: "User logged not active!" });
        }
        if (userAndPermissions.rol.activo === false) {
            res.locals.token = null;
            res.locals.payload = null;
            return res.status(400).json({ success: false, message: "User logged role has not active!" });
        }
        if (userAndPermissions.token !== token) {
            res.locals.token = null;
            res.locals.payload = null;
            return res.status(404).json({ success: false, message: "Invalid user token!" });
        }
        const data = userAndPermissions.rol.roles_permisos.map(rol_perm => {
            return {
                slug: rol_perm.permiso.slug,
                permit: Object.assign({}, rol_perm)
            };
        });
        if (validatePermissions({ req, data }) === false) {
            return res.status(403).json({ success: false, message: "You dont have permission to this action!" });
        }
        return next();
    }
    catch (error) {
        console.error("Internal server error on middleware checking user session.", { error });
        return res.status(500).json({ success: false, message: "Internal server error on middleware checking user session.", data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.validateActiveUser = validateActiveUser;
const validatePermissions = ({ req, data }) => {
    var _a;
    const slug = req.originalUrl.split('/').slice(3).join('/').replace(/\d+/g, '#');
    const method = req.method.toUpperCase();
    const verb = verbConversion[method];
    const hasPermittion = (_a = data.map(entry => {
        return (entry.slug === slug
            && entry.permit[verb]);
    }).filter(entry => entry)[0]) !== null && _a !== void 0 ? _a : false;
    console.log({ base: req.originalUrl, slug, method, verb, data, hasPermittion });
    console.log({ data });
    return hasPermittion;
};
