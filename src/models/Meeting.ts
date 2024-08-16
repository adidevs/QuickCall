import mongoose, { Schema, Document } from "mongoose";

export interface IMeeting extends Document {
  id: string;
  members: string[];
  createdBy: string;
  createdAt: Date;
}

const MeetingSchema: Schema = new Schema({
  id: { type: String, required: true },
  members: [{ type: String, required: true }],
  createdBy: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

const Meeting =
  mongoose.models.Meeting || mongoose.model<IMeeting>("Meeting", MeetingSchema);

export default Meeting;
