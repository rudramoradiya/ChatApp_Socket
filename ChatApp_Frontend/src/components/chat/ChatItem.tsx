import React from 'react';
import { Chat, User, Group } from '../../types/chat';
import { Pin, Volume2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from "../ui/avatar";

type ChatItemProfileClickArg = User | Group;
interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
  isDark: boolean;
  onProfileClick?: (arg: ChatItemProfileClickArg) => void;
}

const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL; 

const ChatItem: React.FC<ChatItemProps> = ({ chat, isSelected, onClick, isDark, onProfileClick }) => {
  const { user: currentUser } = useAuth();

let displayName = '';
let displayAvatar = '';
let isOnline = false;
let receiverUser: User | null = null;

const isGroup = chat.isGroupChat && !!chat.group && typeof chat.group === 'object';

if (isGroup) {
  displayName = chat.group?.name || 'Group';
  displayAvatar = chat.group?.groupImage
    ? (chat.group.groupImage.startsWith('http') ? chat.group.groupImage : `${BACKEND_BASE_URL}${chat.group.groupImage}`)
    : '/default-avatar.png';
} else {
  if (Array.isArray(chat.participants) && currentUser) {
    const myId = String((currentUser as any)._id || currentUser.id);
    receiverUser = chat.participants.find((u: any) => {
      return (
        typeof u === 'object' &&
        u !== null &&
        String(u._id || u.id) !== myId
      );
    }) as User;
  }

  displayName = receiverUser?.username || 'Unknown';
  displayAvatar = receiverUser?.profileImage
    ? (receiverUser.profileImage.startsWith('http') ? receiverUser.profileImage : `${BACKEND_BASE_URL}${receiverUser.profileImage}`)
    : '/default-avatar.png';
  isOnline = receiverUser?.status === 'online';
}


  // Format last message time if available
  const formatTime = (dateString: string | Date | undefined) => {
    if (!dateString) return '';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
        isSelected 
          ? 'bg-green-50 dark:bg-green-900/20 border-r-4 border-green-500' 
          : isDark 
            ? 'hover:bg-gray-700' 
            : 'hover:bg-gray-50'
      }`}
    >
      <div className="relative group">
        <div
          className="cursor-pointer"
          onClick={e => {
            e.stopPropagation();
            if (onProfileClick) {
              if (isGroup && chat.group) onProfileClick(chat.group);
              else if (receiverUser) onProfileClick(receiverUser);
            }
          }}
        >
          <Avatar
            src={displayAvatar}
            alt={displayName}
            name={displayName}
            size="lg"
          />
        </div>
      </div>
      <div className="flex-1 ml-3 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <h3
              className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'} cursor-pointer`}
              onClick={e => {
                e.stopPropagation();
                if (onProfileClick) {
                  if (isGroup && chat.group) onProfileClick(chat.group);
                  else if (receiverUser) onProfileClick(receiverUser);
                }
              }}
            >
              {displayName}
            </h3>
          </div>
          {chat.lastMessage && (
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatTime(chat.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {chat.lastMessage?.content || 'No messages yet'}
          </p>
          <div className="flex items-center space-x-1 ml-2">
            {/* Placeholder for unread count or other icons */}
            <Volume2 className="w-3 h-3 text-gray-400 opacity-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;