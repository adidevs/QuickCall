import express, { Request, Response, Application } from 'express';
import { createServer } from 'http';
import { Socket, Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose, { ConnectOptions } from 'mongoose';
require('dotenv').config();
import routes from './routes/routes';
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

const port: string | number = process.env.PORT || 1000;
const app: Application = express();
const server = createServer(app);

mongoose.connect(process.env.CLUSTER_URL as string, { useNewUrlParser: true } as ConnectOptions)
    .then(() => {
        server.listen(process.env.PORT || "1000", () => console.log(`DB CONNECTED AND SERVER RUNNING on port ${port}`))
    })
    .catch((err: Error) => {
        console.log(err.message)
    });


const io = new Server(server, {
    cors: { origin: '*' },
    path: '/soc'
});

const users = ["user1", "user2", "user3", "user4", "user5"];


app.use(cors({ origin: '*' }));
app.use('/', routes);
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Hello Worldddd</h1>');
});


io.on('connection', (socket: Socket) => {

    console.log('Socket connected');
    const username: string = socket.handshake.auth.username;
    socket.on('joinRoom', (room: string, peerId: string) => {
        if (!uuidValidate(room)) {
            socket.emit('invalid-room');
        } else {
            const clients: Set<string> | undefined = io.sockets.adapter.rooms.get(room);
            const numClients: number = clients ? clients.size : 0;
            if (numClients >= 2) {
                socket.emit('room-full');
            } else {
                console.log("ROOM JOINED ", room, peerId);
                socket.join(room);
                socket.broadcast.to(room).emit('new-user', username, peerId);
                socket.on('send message', (message: string) => {
                    console.log(message);
                    io.to(room).emit('receive message', message, username, room);
                })
                socket.on('leave-room', () => {
                    socket.broadcast.to(room).emit('user-left', username);
                    socket.leave(room);
                });
                socket.on('disconnect', () => {
                    socket.leave(room);
                    socket.broadcast.to(room).emit('user-disconnected', username);
                });
            }
        }
    });


    //Write a function that will emit a message from one user to specific user

    socket.on('private message', ({ content, to }) => {
        console.log(content, to);
        socket.to(to).emit('private message', {
            content,
            from: socket.id
        })
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})



