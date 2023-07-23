import { Request, Response } from "express";
import Room from "../models/roomSchema";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

export const createRoom = async (req: Request, res: Response) => {

    //create unique room id using uuid and add to database
    const room = {
        roomId: uuidv4()
    }
    console.log(room.roomId);
    await Room.insertMany(room)
        .then((data) => {
            return res.status(200).json(data[0].roomId);
        })
        .catch((err) => {
            return res.status(500).json(err.message);
        });
    //send back room id to share and store in local storage in client
};

export const validateRoom = async (req: Request, res: Response) => {

    const room = {
        roomId: req.params.id
    };

    if(!uuidValidate(room.roomId))
       return res.status(400).json("INVALID_ROOM_ID");

    await Room.findOne(room)
        .then((data) => {
            return res.status(200).json(data?.roomId);  
        })
        .catch((err) => {
            return res.status(500).json(err.message);
        });
    //client will then establish connection with socket.io and create room
};