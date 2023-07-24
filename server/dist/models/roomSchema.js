"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomSchema = new mongoose_1.default.Schema({
    roomId: {
        type: String,
        required: true
    }
});
const Room = mongoose_1.default.model('room', roomSchema);
exports.default = Room;
//# sourceMappingURL=roomSchema.js.map