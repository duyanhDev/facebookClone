const mongoose = require("mongoose");
const { Schema } = mongoose;

const SchemaMessage = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Ensure this matches the model name
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Ensure this matches the model name
      required: true,
    },
    content: { type: String, required: true },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Messages = mongoose.model("Messages", SchemaMessage); // Ensure this matches the model name

module.exports = Messages;
