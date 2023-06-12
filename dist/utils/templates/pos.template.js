"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSTemplate = void 0;
const POSTemplate = (data) => {
    const dateString = data.fecha.toLocaleDateString('es-DO', { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" });
    const content = `
    <!DOCTYPE html>
        <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>${data.title}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        border: border-box;
                        font-family: 'Lucida Sans';
                    }
                    body > * {
                        display: flex;
                        flex-direction: column;
                        flex-wrap: nowrap;
                        justify-content: center;
                        text-align: center;
                    }
                    .logo {
                        max-height: 20mm;
                        width: auto;
                        object-fit: contain;
                        margin-bottom: 5mm;
                        filter: grayscale(100%);
                    }
                    header .sucursal {
                        margin-bottom: 2mm;
                    }
                    
                    main {
                        margin: 0 10mm;
                        border-bottom: 1px #adadad solid;
                    }
                    
                    main p {
                        font-size: 4mm;
                        margin: 2mm auto;
                    }

                    footer small {
                        font-size: 3mm;
                    }
                    
                    @media print {
                        .hidden-print,
                        .hidden-print * {
                            display: none !important;
                        }
                    }
                    
                </style>
            </head>
            <body>
            <header>
                <img src="${data.logo}" alt="header logo" class="logo"/>
                <h5 class="sucursal">SUCURSAL ${data.sucursal.toUpperCase()}</h5>
                <h4>Bienvenido</h4>
                ${data.cliente ? `<h3>${data.cliente}</h3>` : ''}
            </header>
            <br />
            <main>
                <span>Su turno es:</span>
                <h1>${data.secuencia}</h1>
                <p>${data.servicio.toUpperCase()}</p>
            </main>
            <br />
            <footer>
                <small>Emision:
                <br>
                <b>${dateString}</b></small>
            </footer>
            </body>
        </html>
    `;
    const options = {
        // Export options
        directory: "./tmp",
        // Papersize Options: http://phantomjs.org/api/webpage/property/paper-size.html
        height: "120mm",
        width: "80mm",
        border: {
            top: "5mm",
            right: "2mm",
            bottom: "5mm",
            left: "2mm"
        },
        type: "pdf",
        //base: 'file:///' + __dirname.replace('\\','/') + '/src/assets/'
    };
    console.log(__dirname, options.base);
    return { content, options };
};
exports.POSTemplate = POSTemplate;
