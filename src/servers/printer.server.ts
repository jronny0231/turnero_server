import { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } from 'node-thermal-printer';

const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,                                  // Printer type: 'star' or 'epson'
    interface: '\\Desktop-j84lump\impresora clientes',                             // Printer interface
    //interface: 'tcp://192.168.100.33:9100',
    characterSet: CharacterSet.ISO8859_2_LATIN2,              // Printer character set - default: SLOVENIA
    removeSpecialCharacters: false,                           // Removes special characters - default: false
    lineCharacter: "-",                                       // Set character for lines - default: "-"
    breakLine: BreakLine.WORD,                                // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
    options:{                                                 // Additional options
      timeout: 5000                                           // Connection timeout (ms) [applicable only for network printers] - default: 3000
    }
  });   

  printer.isPrinterConnected().then(estado => {
    console.log(estado ? 'Impresora Conectada' : 'Impresora No Conectada' );
  }).catch(err => console.error({PrinterError:err}));

  export default printer;

