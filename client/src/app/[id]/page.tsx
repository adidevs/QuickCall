'use client'
import React, { useContext, useEffect} from "react";
import {SocketContext} from '../SocketContext';
import {useRouter} from "next/navigation";
import styles from './Call.module.css';

export default function Call(){


  const router = useRouter();
  const {localVideoRef, remoteVideoRef, peerId, sendMessage, connect, disconnect, isConnected} = useContext(SocketContext);
  
  useEffect(() => {

    if(isConnected)
      return router.push('/');

      if (typeof window !== 'undefined') {

        window.navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((localStream: MediaStream) => {
        localVideoRef.current.srcObject = localStream;
      })
      .catch((err: any) => {
        console.log('Failed to get local stream', err);
      });
        // Your code that uses the navigator object
        // For example, you might want to access the user's geolocation or use the MediaDevices API here
      }

      
    connect();

  });

  const hangUp = () => {
    disconnect();
    router.push('/');
  }

  
  return (
    <div className="Home">
      <button onClick={sendMessage}>Send Message</button>
      <h1>Video Call</h1>
      <div >
        <span className="Local">
          <video className={styles.video} ref={localVideoRef} id="localVideo" autoPlay playsInline></video>
        </span>
        <span className="Remote">
          <video className={styles.video}  ref={remoteVideoRef} id="remoteVideo" autoPlay playsInline></video>
        </span>
      </div>
      <p>Peer Id: {peerId}</p>
      <div className="RoomOptions">
        <button>Mute</button>
        <button>Video</button>
        <button onClick={hangUp}>Hang Up</button>
      </div>
    </div>
  )
}

