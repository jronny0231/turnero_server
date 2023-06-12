"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_thermal_printer_1 = require("node-thermal-printer");
const printer = new node_thermal_printer_1.ThermalPrinter({
    type: node_thermal_printer_1.PrinterTypes.EPSON,
    interface: '\\Desktop-j84lump\impresora clientes',
    //interface: 'tcp://192.168.100.33:9100',
    characterSet: node_thermal_printer_1.CharacterSet.ISO8859_2_LATIN2,
    removeSpecialCharacters: false,
    lineCharacter: "-",
    breakLine: node_thermal_printer_1.BreakLine.WORD,
    options: {
        timeout: 5000 // Connection timeout (ms) [applicable only for network printers] - default: 3000
    }
});
printer.isPrinterConnected().then(estado => {
    console.log(estado ? 'Impresora Conectada' : 'Impresora No Conectada');
}).catch(err => console.error({ PrinterError: err }));
exports.default = printer;
