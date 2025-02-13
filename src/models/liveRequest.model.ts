import mongoose, { Schema } from "mongoose";
const LiveRequestSchema = new mongoose.Schema(
  {
    custUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    rs: {
      type: String,
      enum: ["WAITING_COACH_CONFIRMATION", "ACCEPTED", "FAILED"],
      required: true,
      default: "WAITING_COACH_CONFIRMATION",
    },
  },
  {
    timestamps: true,
  }
);

const LiveRequest =
  mongoose.models.LiveRequest ||
  mongoose.model("LiveRequest", LiveRequestSchema);

export default LiveRequest;
