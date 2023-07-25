'use client'
import React, { useContext } from "react"
import { SocketContext } from './SocketContext';
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RoomInfo() {

    const router = useRouter();
    const { roomId, setRoomId } = useContext(SocketContext);  

    const joinRoom = async () => {
 
        await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/validate/${roomId}`)
            .then((res) => {
                if(!res.data) return alert('ROOM NOT FOUND, CREATE NEW ID!');
                setRoomId(res.data);
                return router.push(`/${roomId}`);
            })
            .catch((err: Error) => {
                return alert(`SERVER ERROR! ${err}`)
            });
    }

    const newRoom = async () => {

        await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/create`)
            .then((res) => {
                if (res.status != 200) return alert('ROOM NOT CREATED, TRY AGAIN!');
                setRoomId(res.data);
                return router.push(`/${roomId}`);
            })
            .catch((err: Error) => {
                return alert(`SERVER ERROR! ${err}`)
        });
    }

    const copyId = () => {
        navigator.clipboard.writeText(roomId);
    }


    return (
        <React.Fragment>
            <button onClick={newRoom}>Create New Room</button>
            <input
                type="text"
                value={roomId}
                onChange={e => {setRoomId(e.target.value)}}
                placeholder='Enter a code or link' />
            <button onClick={joinRoom}>Join</button>
            <button onClick={copyId}>Share ID</button>
        </React.Fragment>
    )
}