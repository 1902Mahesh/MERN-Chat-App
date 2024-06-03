import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await conversation.save();
    await newMessage.save();

    // //this will run in parallel
    // await Promise.all(conversation.save(), newMessage.save());

    //SOCKET IO FUNCTIONALITY

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      //io.to(<SOCKET_ID).emit() use to sent events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const converstion = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); //NOT REFRENCE BUT ACTUAL MESSAGE

    if (!converstion) return res.status(200).json([]);

    const messages = converstion.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessage Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
