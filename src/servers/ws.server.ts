import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
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
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  }
});

wss.on("connection", (socket: WebSocket, _request: Request, client: any) => {
    console.log("User connected!")
    socket.on('error', console.error);

    // send a message to the client
    socket.send(JSON.stringify({
        type: "hello from server",
        content: [ 1, "2" ]
    }));
  
    // receive a message from the client
    socket.on("message", (data: string) => {
        console.log(`Received message ${data} from user ${client}`);

        try {
            const packet = JSON.parse(data);

            console.log({string: data, content: packet});
            switch (packet.type) {
                case "hello from client":
                //
                break;
            }
        } catch (error) {
            console.error({title: "No JSON received", message: error})
        }
    });
  });

  export default wss;