import React, { useRef, useState } from "react";
import { Send, Smile, Paperclip, Mic } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import AttachmentDialog from "./AttachmentDialog";
import { toast } from "sonner";
import socket from "../../socket/socket";
import { useAuth } from "../../contexts/AuthContext";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isDark: boolean;
  chatId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isDark,
  chatId,
}) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user: currentUser } = useAuth();

  // handleSubmit to sendMessage
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const now = new Date().toISOString();
      const msg = {
        sender: currentUser?.id,
        chat: chatId,
        content: message.trim(),
        _id: new Date().getTime(),
        createdAt: now,
        updatedAt: now,
        messageType: "text",
        isRead: false,
      };

      // 🔌 Emit message to socket
      socket.emit("send-message", {
        roomId: chatId,
        message: msg,
        recipientId: null,
      });

      onSendMessage(msg.content);

      // Clear input
      setMessage("");
    } catch (error) {
      console.error("Message send error:", error);
      toast.error("Failed to send message");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    // 🔌 Emit 'typing' event
    socket.emit("typing", {
      roomId: chatId,
      userId: currentUser?.id,
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Set new timeout to emit 'stop_typing'
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop-typing", {
        roomId: chatId,
        userId: currentUser?.id,
      });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  return (
    <>
      <div
        className={`border-t ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        } p-4 flex-shrink-0`}
      >
        <form
          onSubmit={handleSubmit}
          className="flex justify-center items-center space-x-3"
        >
          {/* Message Input Container */}
          <div className="flex-1 relative">
            <div
              className={`flex items-end rounded-2xl border-2 ${
                isDark
                  ? "bg-gray-700 border-gray-600 focus-within:border-green-500"
                  : "bg-gray-50 border-gray-300 focus-within:border-green-500"
              } focus-within:ring-2 focus-within:ring-green-500/20 transition-all duration-200`}
            >
              <textarea
                value={message}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                className={`flex-1 resize-none rounded-l-2xl px-4 py-3 bg-transparent leading-relaxed ${
                  isDark
                    ? "text-white placeholder-gray-400"
                    : "text-gray-900 placeholder-gray-500"
                } focus:outline-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent`}
                style={{
                  minHeight: "48px",
                  maxHeight: "120px",
                }}
              />

              {/* Input Actions */}
              <div className="flex justify-center items-center px-2 pb-3">
                <button
                  type="button"
                  onClick={() => setShowAttachments(true)}
                  className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                    isDark
                      ? "text-gray-400 hover:text-white hover:bg-gray-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(true)}
                  className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                    isDark
                      ? "text-gray-400 hover:text-white hover:bg-gray-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Send/Mic Button */}
          {message.trim() ? (
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              className={`p-3 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>

      {/* Dialogs */}
      <EmojiPicker
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelect={handleEmojiSelect}
        isDark={isDark}
      />

      <AttachmentDialog
        isOpen={showAttachments}
        onClose={() => setShowAttachments(false)}
        isDark={isDark}
      />
    </>
  );
};

export default MessageInput;
