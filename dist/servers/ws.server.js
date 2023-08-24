"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({
    port: Number(process.env.WSS_PORT || 5050),
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        // Below options specified as default values.
        concurrencyLimit: 10,
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed if context takeover is disabled.
    }
});
wss.on("connection", (socket, _request, client) => {
    console.log("User connected!");
    socket.on('error', console.error);
    // send a message to the client
    socket.send(JSON.stringify({
        type: "hello from server",
        content: [1, "2"]
    }));
    // receive a message from the client
    socket.on("message", (data) => {
        console.log(`Received message ${data} from user ${client}`);
        try {
            const packet = JSON.parse(data);
            console.log({ string: data, content: packet });
            switch (packet.type) {
                case "hello from client":
                    //
                    break;
            }
        }
        catch (error) {
            console.error({ title: "No JSON received", message: error });
        }
    });
});
exports.default = wss;
