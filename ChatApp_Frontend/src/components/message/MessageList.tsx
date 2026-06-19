import React, { useEffect, useRef, useState } from "react";
import { Chat, User } from "../../types/chat";
import MessageBubble from "./MessageBubble";
import { Message } from "../../types/chat";
import socket from "../../socket/socket";
import { useAuth } from "../../contexts/AuthContext";

interface MessageListProps {
  chat: Chat | null;
  messages?: Message[]; // Make messages optional, since we'll fetch them here
  isDark: boolean;
  containerRef?: React.RefObject<HTMLDivElement>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  loadingMore?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ chat, messages: propMessages = [], isDark, containerRef, onScroll, loadingMore }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(propMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();
  const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  // Utility function to get proper profile image URL
  const getProfileImageUrl = (imagePath?: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${BACKEND_BASE_URL}${imagePath}`;
  };

  useEffect(() => {
    setMessages(propMessages);
  }, [propMessages]);

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  useEffect(() => {
    const handleTyping = (userId: string) => {
      if (userId !== currentUser?.id) {
        setTypingUserId(userId);
        setIsTyping(true);

        // Stop typing after 3 seconds if no "stop-typing" event received
        setTimeout(() => setIsTyping(false), 3000);
      }
    };

    const handleStopTyping = (userId: string) => {
      if (userId !== currentUser?.id) {
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [currentUser?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div
        className={`flex-1 flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <h3
            className={`text-xl font-semibold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Loading messages...
          </h3>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div
        className={`flex-1 flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <h3
            className={`text-md font-semibold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            No messages yet. Start the conversation!
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className={`flex-1 overflow-y-auto p-4 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      } scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent`}
    >
      {loadingMore && (
        <div className="text-center text-xs text-gray-400 mb-2">Loading more...</div>
      )}
      <div className="max-w-4xl mx-auto">
        {messages.map((message, index) => {
          let senderId =
            typeof message.sender === "object" &&
            message.sender !== null &&
            "id" in message.sender
              ? message.sender.id
              : message.sender;
          const isOwnMessage = senderId === currentUser?.id;
          const prevMessage = index > 0 ? messages[index - 1] : null;
          let prevSenderId = prevMessage
            ? typeof prevMessage.sender === "object" &&
              prevMessage.sender !== null &&
              "id" in prevMessage.sender
              ? prevMessage.sender.id
              : prevMessage.sender
            : null;
          
          // Only show avatar if this is the first message from this sender in a sequence
          const showAvatar = !prevMessage || prevSenderId !== senderId;

          let senderName;
          let senderProfileImage;
          
          if (!isOwnMessage && chat?.isGroupChat) {
            const sender = Array.isArray(chat.participants)
              ? chat.participants.find(
                  (p: any) =>
                    typeof p === "object" &&
                    p !== null &&
                    "id" in p &&
                    p.id === senderId
                )
              : null;
            senderName =
              sender && typeof sender === "object" && "username" in sender
                ? sender.username
                : undefined;
            senderProfileImage =
              sender && typeof sender === "object" && "profileImage" in sender
                ? getProfileImageUrl(sender.profileImage)
                : undefined;
          } else if (!isOwnMessage && typeof message.sender === "object" && message.sender !== null) {
            senderName = message.sender.username;
            senderProfileImage = getProfileImageUrl(message.sender.profileImage);
          }

          return (
            <MessageBubble
              key={`${message.id}-${index}`}
              message={message}
              isOwnMessage={isOwnMessage}
              isDark={isDark}
              showAvatar={showAvatar}
              senderName={senderName}
              senderProfileImage={senderProfileImage}
            />
          );
        })}
      </div>

      {isTyping && (
        <div className="text-sm text-gray-500 italic mb-2">
          {chat?.isGroupChat
            ? `${
                (
                  chat.participants.find(
                    (p): p is User =>
                      typeof p === "object" && p !== null && "id" in p
                  ) as User | undefined
                )?.username || "Someone"
              } is typing...`
            : "Typing..."}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
