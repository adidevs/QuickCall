'use client'
import React, { useEffect, useState, useRef, MutableRefObject, use } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head"
import styles from './Call.module.css';
import { MediaConnection } from "peerjs";
import { io } from "socket.io-client";
import axios from "axios";
import { BsFillCameraVideoFill, BsFillCameraVideoOffFill, BsFillMicMuteFill, BsFillMicFill, BsShareFill } from 'react-icons/bs';
import { ImPhoneHangUp } from 'react-icons/im';
import { MdPresentToAll } from 'react-icons/md';


export default function Call({ params }: { params: { id: string } }) {

  const router = useRouter();
  const roomId = params.id;
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setisVideoOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const remoteVideoRef: any = useRef();
  const localVideoRef: any = useRef();
  const socketRef = useRef<any>();
  const [peerId, setPeerId] = useState<string>('');
  const peerInstance: MutableRefObject<any> = useRef() as MutableRefObject<any>;
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState(false);


  useEffect(() => {
    const roomExists = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/validate/${roomId}`);
        if (!res.data) {
          router.push('/');
        } else {
          navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((localStream: MediaStream) => {
              localVideoRef.current.srcObject = localStream;
            })
            .catch((err: any) => {
              alert('Failed to get local stream' + err);
            });
        }
      } catch (err) {
        router.push('/');
      }
    };

    roomExists();

    //Establish connection
    const Peer = require("peerjs").default;

    const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`, {
      path: '/soc',
    });
    socketRef.current = socket;

    peerInstance.current = new Peer();

    peerInstance.current.on('open', (pid: string) => {
      setPeerId(() => { return pid });
      socket.emit('joinRoom', roomId, pid);
    });

    socket.on('invalid-room', () => {
      alert('Invalid room ID!');
    });

    socket.on('room-full', () => {
      alert('Room Full');
      router.push('/');
    });

    socket.on('new-user', async (user: string, remotepeer: string) => {
      setIsConnected(true);
      if (peerInstance.current === null || peerInstance.current === undefined) {
        peerInstance.current = new Peer();
        while (peerInstance.current.id === null || peerInstance.current.id === undefined) {
          await new Promise(r => setTimeout(r, 500));
        }
      }
      const localVideo = localVideoRef.current;
      const call: MediaConnection = peerInstance.current.call(remotepeer, localVideo.srcObject);
      call.on('stream', (remoteStream: MediaStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        setIsConnected(true);
      }, (err: Error) => {
        alert('Failed to call user: ' + err);
      })
    })

    peerInstance.current.on('call', (call: MediaConnection) => {
      const localVideo = localVideoRef.current;
      const localStream = localVideo.srcObject as MediaStream;
      call.answer(localStream);
      call.on('stream', (remoteStream: MediaStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        setIsConnected(true);
      }, (err: Error) => {
        alert('Failed to call user: ' + err);
      })
    });

    socket.on('user-left', (user: string) => {
      setIsConnected(false);
    });

    //Cleanup
    window.onbeforeunload = () => {
      const localVideo = localVideoRef.current;
      const localStream = localVideo.srcObject as MediaStream;
      const tracks = localStream.getTracks();

      tracks.forEach((track: MediaStreamTrack) => {
        track.stop();
      });
      disconnect();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disconnect = () => {
    setIsConnected(false);
    const localVideo = localVideoRef.current;
    const localStream = localVideo.srcObject as MediaStream;
    const tracks = localStream.getTracks();

    tracks.forEach((track: MediaStreamTrack) => {
      track.stop();
    });

    localVideo.srcObject = null;
    peerInstance.current.destroy();
    socketRef.current.emit('leave-room', roomId, peerId);
  }


  const hangUp = () => {
    disconnect();
    router.push('/');
  }

  const shareScreen = () => {

    const localVideo = localVideoRef.current;
    const localStream = localVideo.srcObject as MediaStream;
    const tracks = localStream.getTracks()[0];

    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      .then((localStream: MediaStream) => {

        localVideoRef.current.srcObject = localStream;
        tracks.stop();
        setIsSharingScreen(true);

        localStream.getVideoTracks()[0].onended = () => {
          navigator.mediaDevices.getUserMedia({ video: true, audio: (isMuted) ? false : true })
            .then((localStream: MediaStream) => {
              if (isVideoOff) toggleVideo();
              localVideoRef.current.srcObject = localStream;
            })
            .catch((err: any) => {
              alert('Failed to get local stream' + err);
            });
          setIsSharingScreen(false);
        }

      })
      .catch((err: any) => {
        setIsSharingScreen(false);
        alert('Failed to get local stream' + err);
      });
  }

  const toggleVideo = () => {
    setisVideoOff(!isVideoOff);
    const localVideo = localVideoRef.current;
    const localStream = localVideo.srcObject as MediaStream;
    const tracks = localStream.getTracks();

    tracks.forEach((track: MediaStreamTrack) => {
      if (track.kind === 'video') {
        if (isVideoOff) {
          navigator.mediaDevices.getUserMedia({ video: true, audio: (isMuted) ? false : true })
            .then((localStream: MediaStream) => {
              localVideoRef.current.srcObject = localStream;
              setisVideoOff(false);
            })
            .catch((err: any) => {
              alert('Failed to get local stream' + err);
            });
        }
        else {
          track.stop();
          setisVideoOff(true);
        }
      }
    });
  }

  const toggleAudio = () => {
    setIsMuted(!isMuted);
    const localVideo = localVideoRef.current;
    const localStream = localVideo.srcObject as MediaStream;
    const tracks = localStream.getTracks();

    tracks.forEach((track: MediaStreamTrack) => {
      if (track.kind === 'audio') {
        if (isMuted) {
          navigator.mediaDevices.getUserMedia({ video: (isVideoOff) ? false : true, audio: true })
            .then((localStream: MediaStream) => {
              localVideoRef.current.srcObject = localStream;
              setIsMuted(false);
            })
            .catch((err: any) => {
              alert('Failed to get local stream' + err);
            });
        }
        else {
          track.stop();
          setIsMuted(true);
        }
      }
    });
  }

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  }

  return (
    <main>
      <Head>
        <title>Call: {roomId}</title>
      </Head>
      <div className={styles.page}>
        <h2 className={styles.roomId}>{roomId}</h2>
        <div className={styles.videoContainer}>
          <video className={styles.localVideo} ref={localVideoRef} id="localVideo" autoPlay playsInline></video>
          {true &&
            <video className={styles.remoteVideo} ref={remoteVideoRef} id="remoteVideo" autoPlay playsInline></video>}
        </div>
        <div className={styles.optionsContainer}>

          <button className={(isVideoOff) ? styles.mediaBtnOff : styles.mediaBtnOn} onClick={toggleVideo}>
            {(isVideoOff) ? <BsFillCameraVideoOffFill /> : <BsFillCameraVideoFill />}
          </button>

          <button className={(isMuted) ? styles.mediaBtnOff : styles.mediaBtnOn} onClick={toggleAudio}>
            {(isMuted) ? <BsFillMicMuteFill /> : <BsFillMicFill />}
          </button>
          <button className={styles.mediaBtnOff} onClick={hangUp}><ImPhoneHangUp /></button>
          <button className={styles.shareBtn} onClick={shareScreen} disabled={(isSharingScreen) ? true : false}><MdPresentToAll/></button>
          <button className={styles.shareBtn} onClick={copyRoomId}><BsShareFill /></button>
          {showPopup && <div className={styles.popup}>Room ID Copied!</div>}
        </div>
      </div>
    </main>
  )
}

