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
  name: string,
  setName: any,
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
  name: '',
  isConnected: false,
  connect: () => { },
  disconnect: () => { },
  setRoomId: () => { },
  setName: () => { },
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
  const [name, setName] = useState<string>('test');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>('');
  const remoteVideoRef: any = useRef<HTMLVideoElement>(null);
  const localVideoRef: any = useRef<HTMLVideoElement>(null);
  const peerInstance: MutableRefObject<any> = useRef() as MutableRefObject<any>;
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {

    //if (typeof window !== 'undefined') {
      const Peer = require("peerjs").default;

      const socket = io('http://localhost:1000', {
        path: '/soc',
        auth: {
          username: name
        }
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
        if (localVideoRef.current === null) {
          window.navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((localStream: MediaStream) => {
              localVideoRef.current.srcObject = localStream;
            })
            .catch((err: any) => {
              console.log('Failed to get local stream', err);
            });
        }

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
        window.navigator.mediaDevices.getUserMedia({ video: true, audio: false })
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
      peerInstance.current.disconnect();
      //window.history.back();
    });

    return () => {
      socket.disconnect();
    };
  
  });

  const connect = async () => {
    if (isConnected) return peerInstance.current.reconnect;
    setIsConnected(true);
    socketRef.current.emit('joinRoom', roomId, peerId);
  }

  const disconnect = async () => {
    if (!isConnected) return;
    setIsConnected(false);
    peerInstance.current.disconnect();
    socketRef.current.emit('leave-room', roomId, peerId);
    console.log("Left");
  }

  const sendMessage = async () => {
    console.log("sendMessage");
    socketRef.current.emit('send message', "Testing 123");
  }
  //PeerJS

  return (
    <SocketContext.Provider value={{ name, setName, connect, disconnect, roomId, setRoomId, sendMessage, peerId, remotePeerIdValue, setRemotePeerIdValue, remoteVideoRef, localVideoRef, isConnected }}>
      {children}
    </SocketContext.Provider>);
}

export { ContextProvider, SocketContext };

//     const localVideoRef = useRef();

//     const [localStream, setLocalStream] = useState(null);
//     const [callAccepted, setCallAccepted] = useState(false);
//     const [callEnded, setCallEnded] = useState(false);
//     const [call, setCall] = useState({});
//     const [name, setName] = useState('');
//     const [me, setMe] = useState('');

//     useEffect(() => {
//         navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//             .then((currentStream) => {
//                 setLocalStream(currentStream);
//                 localVideoRef.current.srcObject = currentStream;
//             })
//             .catch((err) => {
//                 console.log('error', err);
//             });

//             socket.on('me', (id) => {
//                 setMe(id);
//             });

//             socket.on('calluser', ({ from, name: callerName, signal }) => {
//                 setCall({ isReceivedCall: true, from, name: callerName, signal });
//             });
//     }, []);
// }

// const answerCall = () => {

//     setCallAccepted(true);

//     const peer = new Peer({ initiator: false, trickle: false, stream: localStream });


// }

// const callUser = () => {
// }

// const leaveCall = () => {

// }
