'use client'
import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from '../SocketContext';
import { useRouter } from "next/navigation";
import styles from './Call.module.css';

export default function Call() {


  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const { localVideoRef, remoteVideoRef, peerId, sendMessage, connect, disconnect, isConnected } = useContext(SocketContext);

  useEffect(() => {

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((localStream: MediaStream) => {
        localVideoRef.current.srcObject = localStream;
      })
      .catch((err: any) => {
        console.log('Failed to get local stream', err);
    });

    window.onbeforeunload = () => {
      stopLocalStream();
    }
    
    connect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopLocalStream = () => {
    const localVideo = localVideoRef.current;
    const localStream = localVideo.srcObject as MediaStream;
    const tracks = localStream.getTracks();

    tracks.forEach((track: MediaStreamTrack) => {
      track.stop();
    });

    localVideo.srcObject = null;
  }

  const hangUp = () => {
    disconnect();
    stopLocalStream();
    router.push('/');
  }

  const toggleAudio = () => {
    setIsMuted(!isMuted);
    const localVideo = localVideoRef.current;
    const localStream = localVideo.srcObject as MediaStream;
    const tracks = localStream.getTracks();

    tracks.forEach((track: MediaStreamTrack) => {
      if (track.kind === 'audio') {
        track.enabled = !track.enabled;
      }
    });
  }
  


  return (
    <div className="Home">
      <h1>Video Call</h1>
      <div >
        <span className="Local">
          <video className={styles.video} ref={localVideoRef} id="localVideo" autoPlay playsInline></video>
        </span>
        <span className="Remote">
          <video className={styles.video} ref={remoteVideoRef} id="remoteVideo" autoPlay playsInline></video>
        </span>
      </div>
      <p>Peer Id: {peerId}</p>
      <div className="RoomOptions">
        <button>Video</button>
        <button onClick={toggleAudio}>{(isMuted)?"UnMute":"Mute"}</button>
        <button onClick={hangUp}>Hang Up</button>
      </div>
    </div>
  )
}

