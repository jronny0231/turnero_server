import printer from "../servers/printer.server";
import pdf from 'html-pdf';
import { POSTemplate } from "../utils/templates/pos.template";

export type queueDataIncome = {
    sucursal: string
    secuencia_ticket: string
    servicio_destino: string
    createdAt: Date
}

export const printPOSQueue = (data: queueDataIncome) => {

    // Align all content to center
    printer.alignCenter()
    printer.setTypeFontA()

    // Print Sucursal nombre
    printer.bold(true)
    printer.println(`SUCURSAL: ${data.sucursal.toUpperCase()}`)

    // Print Secuencia Ticket
    printer.bold(false)
    printer.println("Su turno es:")
    printer.bold(true)
    printer.setTypeFontB()
    printer.setTextQuadArea()
    printer.println(data.secuencia_ticket);

    // Print separator and space between
    printer.newLine();
    printer.drawLine();
    printer.newLine(); 
    
    // Print Servicio Destino
    printer.setTypeFontA()
    printer.setTextNormal()
    printer.bold(false)
    printer.println(`Servicio: ${data.servicio_destino}`);

    printer.newLine();
    printer.newLine();

    // Print createdAt
    const dateString: string = data.createdAt.toLocaleDateString('es-DO', { weekday:"long", year:"numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric"}) 
    printer.setTypeFontB()
    printer.println(`Emision: ${dateString}`);
    printer.newLine();
    printer.bold(false);

    // Print separator and space between
    printer.newLine();
    printer.drawLine();
    printer.newLine(); 

    printer.isPrinterConnected().then(isConnect => {
        if(isConnect) printer.execute();
        else console.log("Printer not connected");
    })
}

export const exportPOSQueue = async (data: queueDataIncome) => {

    const logo: string = "https://invisrd.com/images/imagenes/layout/logo.png";

    const htmlTemplate = POSTemplate({
        title: "Impresion de ticket",
        logo: logo,
        secuencia: data.secuencia_ticket,
        sucursal: data.sucursal,
        servicio: data.servicio_destino,
        fecha: data.createdAt        
    });


    pdf.create(htmlTemplate.content, htmlTemplate.options).toFile('./src/exports/ticket.pdf', function(err, res) {
    if (err) return console.error(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
    });

}