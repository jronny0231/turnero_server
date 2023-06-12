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
exports.exportPOSQueue = exports.printPOSQueue = void 0;
const printer_server_1 = __importDefault(require("../servers/printer.server"));
const html_pdf_1 = __importDefault(require("html-pdf"));
const pos_template_1 = require("../utils/templates/pos.template");
const printPOSQueue = (data) => {
    // Align all content to center
    printer_server_1.default.alignCenter();
    printer_server_1.default.setTypeFontA();
    // Print Sucursal nombre
    printer_server_1.default.bold(true);
    printer_server_1.default.println(`SUCURSAL: ${data.sucursal.toUpperCase()}`);
    // Print Secuencia Ticket
    printer_server_1.default.bold(false);
    printer_server_1.default.println("Su turno es:");
    printer_server_1.default.bold(true);
    printer_server_1.default.setTypeFontB();
    printer_server_1.default.setTextQuadArea();
    printer_server_1.default.println(data.secuencia_ticket);
    // Print separator and space between
    printer_server_1.default.newLine();
    printer_server_1.default.drawLine();
    printer_server_1.default.newLine();
    // Print Servicio Destino
    printer_server_1.default.setTypeFontA();
    printer_server_1.default.setTextNormal();
    printer_server_1.default.bold(false);
    printer_server_1.default.println(`Servicio: ${data.servicio_destino}`);
    printer_server_1.default.newLine();
    printer_server_1.default.newLine();
    // Print createdAt
    const dateString = data.createdAt.toLocaleDateString('es-DO', { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" });
    printer_server_1.default.setTypeFontB();
    printer_server_1.default.println(`Emision: ${dateString}`);
    printer_server_1.default.newLine();
    printer_server_1.default.bold(false);
    // Print separator and space between
    printer_server_1.default.newLine();
    printer_server_1.default.drawLine();
    printer_server_1.default.newLine();
    printer_server_1.default.isPrinterConnected().then(isConnect => {
        if (isConnect)
            printer_server_1.default.execute();
        else
            console.log("Printer not connected");
    });
};
exports.printPOSQueue = printPOSQueue;
const exportPOSQueue = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const logo = "https://invisrd.com/images/imagenes/layout/logo.png";
    const htmlTemplate = (0, pos_template_1.POSTemplate)({
        title: "Impresion de ticket",
        logo: logo,
        secuencia: data.secuencia_ticket,
        sucursal: data.sucursal,
        servicio: data.servicio_destino,
        fecha: data.createdAt
    });
    html_pdf_1.default.create(htmlTemplate.content, htmlTemplate.options).toFile('./src/exports/ticket.pdf', function (err, res) {
        if (err)
            return console.error(err);
        console.log(res); // { filename: '/app/businesscard.pdf' }
    });
});
exports.exportPOSQueue = exportPOSQueue;
