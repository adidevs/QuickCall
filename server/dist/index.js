"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const peer_1 = require("peer");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
const routes_1 = __importDefault(require("./routes/routes"));
const port = process.env.PORT || 1000;
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
mongoose_1.default.connect(process.env.CLUSTER_URL, { useNewUrlParser: true })
    .then(() => {
    server.listen(process.env.PORT || "1000", () => console.log(`DB CONNECTED AND SERVER RUNNING on port ${port}`));
})
    .catch((err) => {
    console.log(err.message);
});
const peerServer = (0, peer_1.ExpressPeerServer)(server, {
    path: '/server',
    allow_discovery: true,
    corsOptions: { origin: '*' }
});
const io = new socket_io_1.Server(server, {
    cors: { origin: '*' },
    path: '/soc'
});
const users = ["user1", "user2", "user3", "user4", "user5"];
app.use('/peer', peerServer);
app.use((0, cors_1.default)({ origin: '*' }));
app.use('/', routes_1.default);
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('<h1>Hello Worldddd</h1>');
});
peerServer.on('connection', (client) => {
    console.log('peer connected', client.id);
});
peerServer.on('disconnect', (client) => {
    console.log('peer disconnected', client.id);
});
io.on('connection', (socket) => {
    console.log('Socket connected');
    const username = socket.handshake.auth.username;
    socket.on('joinRoom', (room, peerId) => {
        console.log("ROOM JOINED ", room, peerId);
        socket.join(room);
        socket.broadcast.to(room).emit('new-user', username, peerId);
        socket.on('send message', (message) => {
            console.log(message);
            io.to(room).emit('receive message', message, username, room);
        });
        socket.on('leave-room', () => {
            socket.broadcast.to(room).emit('user-left', username);
            socket.leave(room);
        });
        socket.on('disconnect', () => {
            socket.broadcast.to(room).emit('user-disconnected', username);
        });
    });
    //Write a function that will emit a message from one user to specific user
    socket.on('private message', ({ content, to }) => {
        console.log(content, to);
        socket.to(to).emit('private message', {
            content,
            from: socket.id
        });
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
//# sourceMappingURL=index.js.map