import React from 'react';
import { Message, User } from '../../types/chat';
import { Check, CheckCheck } from 'lucide-react';
import { Avatar } from '../../components/ui/avatar';
import { useAuth } from '../../contexts/AuthContext';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  isDark: boolean;
  showAvatar: boolean;
  senderName?: string;
  senderProfileImage?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwnMessage, 
  isDark, 
  showAvatar, 
  senderName,
  senderProfileImage
}) => {
  const { user: currentUser } = useAuth();
  const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  const formatTime = (date: string | Date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "Invalid time";

    return parsedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Utility function to get proper profile image URL
  const getProfileImageUrl = (imagePath?: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${BACKEND_BASE_URL}${imagePath}`;
  };

  // Get sender info from message
  const getSenderInfo = () => {
    if (isOwnMessage && currentUser) {
      return {
        name: currentUser.username || 'You',
        profileImage: getProfileImageUrl(currentUser.profileImage)
      };
    }
    
    if (typeof message.sender === 'object' && message.sender !== null) {
      return {
        name: message.sender.username || 'Unknown',
        profileImage: getProfileImageUrl(message.sender.profileImage)
      };
    }
    
    return {
      name: senderName || 'Unknown',
      profileImage: getProfileImageUrl(senderProfileImage)
    };
  };

  const senderInfo = getSenderInfo();

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2 group`}
    >
      {/* Avatar for received messages - only show if showAvatar is true */}
      {!isOwnMessage && showAvatar && (
        <div className="flex-shrink-0 mr-2 self-end mb-1">
          <Avatar
            src={senderInfo.profileImage}
            alt={senderInfo.name}
            name={senderInfo.name}
            size="sm"
            className="w-7 h-7"
          />
        </div>
      )}

      {/* Message content */}
      <div
        className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}
      >
        <div
          className={`px-3 py-2 rounded-2xl shadow-sm
            ${isOwnMessage
              ? 'bg-blue-500 text-white rounded-br-md'
              : isDark
                ? 'bg-gray-700 text-white rounded-bl-md'
                : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
            }
          `}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>

          <div
            className={`flex items-center justify-end mt-1 space-x-1 ${
              isOwnMessage
                ? 'text-blue-100'
                : isDark
                  ? 'text-gray-400'
                  : 'text-gray-500'
            }`}
          >
            <span className="text-xs">
              {formatTime(message.createdAt)}
            </span>
            {isOwnMessage && (
              <div className="flex">
                {message.isRead ? (
                  <CheckCheck className="w-3 h-3 text-blue-200" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar for sent messages - only show if showAvatar is true */}
      {isOwnMessage && showAvatar && (
        <div className="flex-shrink-0 ml-2 self-end mb-1">
          <Avatar
            src={senderInfo.profileImage}
            alt={senderInfo.name}
            name={senderInfo.name}
            size="sm"
            className="w-7 h-7"
          />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;