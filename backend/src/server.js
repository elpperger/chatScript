// const { WebSocketServer } = require("ws");
// const dotenv = require("dotenv");

// dotenv.config();

// const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

// // Objeto para rastrear os clientes e suas salas associadas
// const clients = new Map();

// wss.on("connection", (ws) => {
//     ws.on("error", console.error);

//     ws.on("message", (data) => {
//         const message = JSON.parse(data.toString());
//         const { room } = message;

//         console.log("Mensagem recebida no servidor:", message);

//         // Verifica se a sala está associada ao cliente
//         if (clients.get(ws) && clients.get(ws).room === room) {
//             wss.clients.forEach((client) => {
//                 // Envie a mensagem apenas para os clientes na mesma sala
//                 if (clients.get(client) && clients.get(client).room === room) {
//                     client.send(JSON.stringify(message));
//                     console.log("Mensagem enviada para o cliente:", message);
//                 }
//             });
//         }
//     });

//     console.log("Cliente conectado");

//     // Adiciona o cliente ao mapa de clientes com sua sala associada
//     ws.on("close", () => {
//         clients.delete(ws);
//         console.log("Cliente desconectado");
//     });
// });

// // Lógica movida para dentro do evento "connection"
// wss.on("headers", (headers, request) => {
//     // Extrai o nome da sala dos cabeçalhos da solicitação
//     const room = request.url.split("/")[1];

//     console.log("Sala do cliente:", room);

//     // Adiciona o cliente ao mapa de clientes com sua sala associada
//     clients.set(request.socket, { room });
// });


const { WebSocketServer } = require("ws")
const dotenv = require("dotenv")

dotenv.config()

const wss = new WebSocketServer({ port: process.env.PORT || 8080 })

wss.on("connection", (ws) => {
    ws.on("error", console.error)

    ws.on("message", (data) => {
        wss.clients.forEach((client) => client.send(data.toString()))
    })

    console.log("client connected")
})

