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
app.get('/', (req, res) => {
    res.send('<h1>Hello Worldddd</h1>');
});
peerServer.on('connection', (client) => {
    console.log('client connected', client.id);
});
peerServer.on('disconnect', (client) => {
    console.log('client disconnected', client.id);
});
io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.id);
    console.log(socket.handshake.auth);
    socket.on('chat message', (message) => {
        console.log(message);
        io.emit('message', `${socket.id.substring(0, 2)} said ${message}`);
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