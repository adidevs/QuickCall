'use client'
import React, { createContext, useState, useRef, useEffect, MutableRefObject } from 'react';
import { Socket, io } from 'socket.io-client';
import { MediaConnection } from 'peerjs';


interface ISocketContext {
  localVideoRef: any,
  remoteVideoRef: any,
  peerId: string,
  remotePeerIdValue: string,
  setRemotePeerIdValue: any,
  roomId: string,
  setRoomId: any,
  isConnected: boolean,
  connect: VoidFunction,
  disconnect: VoidFunction,
  sendMessage: VoidFunction,
  socketRef?: Socket,
  peerInstance?: any,
}

const defaultState: ISocketContext = {
  localVideoRef: null,
  remoteVideoRef: null,
  peerId: '',
  remotePeerIdValue: '',
  roomId: '',
  isConnected: false,
  connect: () => { },
  disconnect: () => { },
  setRoomId: () => { },
  setRemotePeerIdValue: () => { },
  sendMessage: () => { },
}

const SocketContext = createContext<ISocketContext>(defaultState);
//Partial<ISocketContext> means that all the properties of ISocketContext are optional.
//But it was not used here because we want to make sure that all the properties are defined.

const ContextProvider = ({ children }: any) => {

  //Socket.io
  const socketRef = useRef<any>();
  const [roomId, setRoomId] = useState('');
  const [peerId, setPeerId] = useState<string>('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>('');
  const remoteVideoRef: any = useRef<HTMLVideoElement>(null);
  const localVideoRef: any = useRef<HTMLVideoElement>(null);
  const peerInstance: MutableRefObject<any> = useRef() as MutableRefObject<any>;
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {

    //if (typeof window !== 'undefined') {
      const Peer = require("peerjs").default;

      const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`, {
        path: '/soc',
      });

      socketRef.current = socket;

      peerInstance.current = new Peer();

      peerInstance.current.on('open', (pid: string) => {
        setPeerId(pid);
        console.log('My peer ID is: ' + pid);
        // socketRef.current.emit('joinRoom', roomId, pid);
      });

      socket.onAny((event, ...args) => {
        //console.log(event, args);
      });



      socket.on('new-user', (user: string, remotepeer: string) => {
        console.log('REMOTE PEER = ', remotepeer);
        // if (remotePeerIdValue === peerId)
        //   return alert("You are trying to call yourself!");

        //console.log(peerInstance.current);

        console.log(peerInstance.current)

        const call: MediaConnection = peerInstance.current.call(remotepeer, localVideoRef.current.srcObject);
        console.log(call)
        call.on('stream', (remoteStream: MediaStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        }, (err: Error) => {
          alert('Failed to call user: ' + err);
        })
      })

      peerInstance.current.on('call', (call: MediaConnection) => {
        console.log("call Received");
        window.navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((localStream: MediaStream) => {
            localVideoRef.current.srcObject = localStream;
            call.answer(localStream);
            call.on('stream', (remoteStream: MediaStream) => {
              remoteVideoRef.current.srcObject = remoteStream;
              console.log("remoteStream");
            })
          })
          .catch((err: any) => {
            console.log('Failed to get local stream', err);
          });
      });

    



    socket.on('receive message', (message: string, user: string) => {
      console.log('dfsgdsfgdsf', message, user);
    });

    socket.on('user-left', (user: string) => {
      setIsConnected(false);
      peerInstance.current.destroy();
      window.history.back(); 
    });

    return () => {
      socket.disconnect();
    };
  
  }, []);

  const connect = async () => {
    if (isConnected) return peerInstance.current.reconnect;
    setIsConnected(true);
    socketRef.current.emit('joinRoom', roomId, peerId);
  }

  const disconnect = () => {
    if (!isConnected) return;
    setIsConnected(false);
    //peerInstance.current.disconnect();
    socketRef.current.emit('leave-room', roomId, peerId);
    console.log("Left");
  }

  const sendMessage = async () => {
    console.log("sendMessage");
    socketRef.current.emit('send message', "Testing 123");
  }
  //PeerJS

  return (
    <SocketContext.Provider value={{connect, disconnect, roomId, setRoomId, sendMessage, peerId, remotePeerIdValue, setRemotePeerIdValue, remoteVideoRef, localVideoRef, isConnected }}>
      {children}
    </SocketContext.Provider>);
}

export { ContextProvider, SocketContext };