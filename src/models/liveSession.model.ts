import mongoose, { Schema } from "mongoose";

const ParticipantSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["CUSTOMER", "COACH"],
    required: true,
  },
  jTime: {
    type: Date,
    default: null,
  },
  rs: {
    type: String,
    enum: ["JOINED", "BOOKED"],
    required: true,
  },
});

const LiveSessionSchema = new mongoose.Schema(
  {
    lsId: {
      type: Schema.Types.ObjectId,
      ref: "LiveRequest",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coachUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: {
      type: Number, // Unix timestamp (seconds)
      required: true,
    },
    endTime: {
      type: Number, // Unix timestamp (seconds) or null
      default: null,
    },
    rs: {
      type: String,
      enum: ["IN_PROGRESS", "FINISHED"],
      required: true,
      default: "IN_PROGRESS",
    },
    participants: [ParticipantSchema], // Array of participants
  },
  {
    timestamps: true,
  }
);

const LiveSession =
  mongoose.models.LiveSession ||
  mongoose.model("LiveSession", LiveSessionSchema);

export default LiveSession;
