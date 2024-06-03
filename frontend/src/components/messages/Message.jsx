import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../utils/extractTime";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();

  const fromatedTime = extractTime(message.createdAt);
  const fromMe = message.senderId === authUser._id;
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;

  const bubbleBgColor = fromMe ? "bg-blue-500" : "";
  const shakeClass = message.shouldShake ? "shake" : "";

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Tailwind CSS chat Bubble Component" src={profilePic} />
        </div>
      </div>
      <div
        className={`chat-bubble text-white pb-2 ${bubbleBgColor} ${shakeClass}`}
      >
        {message.message}
      </div>
      <div className={`chat-footer opacity-50 text-xs flex gap-1 items-center`}>
        {fromatedTime}
      </div>
    </div>
  );
};

export default Message;

// const Message = () => {
//     return (
//       <div className="chat chat-end">
//         <div className="chat-image avatar">
//           <div className="w-10 rounded-full">
//             <img
//               alt="Tailwind CSS chat Bubble Component"
//               src={
//                 "https://cdn1.iconfinder.com/data/icons/facely-metapeople-3d-avatar-set/512/15._Astronaut.png"
//               }
//             />
//           </div>
//         </div>
//         <div className={`chat-bubble text-white bg-blue-500`}>
//           Hi! What is Up?
//         </div>
//         <div className={`chat-footer opacity-50 text-xs flex gap-1 items-center`}>
//           12:42
//         </div>
//       </div>
//     );
//   };
