"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRoom = exports.createRoom = void 0;
const roomSchema_1 = __importDefault(require("../models/roomSchema"));
//import uuid
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //create unique room id using uuid and add to database
    res.send("room created");
    // await Room.insertMany({});
    //send back room id to share and store in local storage in client
});
exports.createRoom = createRoom;
const validateRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomID = req.params.id;
    yield roomSchema_1.default.find();
    //send back confirmation that room exists
    //client will then establish connection with socket.io and create room
});
exports.validateRoom = validateRoom;
//# sourceMappingURL=rooms.js.map