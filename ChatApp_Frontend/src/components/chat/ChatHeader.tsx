import React from 'react';
import { Phone, Video, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chat } from '../../types/chat';
import ChatHeaderMenu from './ChatHeaderMenu';
import { User } from '../../types/chat';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from "../ui/avatar";

interface ChatHeaderProps {
  chat: Chat | null;
  isDark: boolean;
  isMobile: boolean;
  onBackClick: () => void;
  onAddToFavourites: () => void;
  onClearChat: () => void;
  onDeleteChat: () => void;
  onBlockUser: () => void;
  onViewInfo: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  chat, 
  isDark, 
  isMobile, 
  onBackClick,
  onAddToFavourites,
  onClearChat,
  onDeleteChat,
  onBlockUser,
  onViewInfo
}) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  if (!chat) {
    return (
      <div className={`h-16 border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex items-center justify-center shadow-sm`}>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Select a chat to start messaging
        </p>
      </div>
    );
  }  

  const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  // Helper to get display name and avatar
  let displayName = '';
  let displayAvatar = '';
  let isOnline = false;

  if (chat.isGroupChat && chat.group && typeof chat.group === 'object') {
    displayName = chat.group.name || 'Group';
    displayAvatar = chat.group.groupImage
      ? (chat.group.groupImage.startsWith('http') ? chat.group.groupImage : `${BACKEND_BASE_URL}${chat.group.groupImage}`)
      : '/default-avatar.png';
  } else {
    // One-to-one chat: find the other participant (not the current user)
    let otherUser: User | null = null;
    if (Array.isArray(chat.participants) && currentUser) {
      const myId = String((currentUser as any)._id || currentUser.id);
      otherUser = chat.participants.find(
        (u: any) =>
          typeof u === 'object' &&
          u !== null &&
          String(u._id || u.id) !== myId
      ) as User;
    }
    displayName = otherUser?.username || 'Unknown';
    displayAvatar = otherUser?.profileImage || '/default-avatar.png';
    isOnline = otherUser?.status === 'online';
  }

  const getStatusText = () => {
    if (chat.isGroupChat && chat.group && typeof chat.group === 'object') {
      const participantCount = chat.participants.length;
      const onlineCount = chat.participants.filter(
        (p: any) => typeof p === 'object' && p !== null && p.status === 'online'
      ).length;
      return `${participantCount} participants${onlineCount > 0 ? `, ${onlineCount} online` : ''}`;
    } else {
      let otherUser: User | null = null;
      if (Array.isArray(chat.participants) && currentUser) {
        const myId = (currentUser as any)._id || currentUser.id;
        otherUser = chat.participants.find(
          (u: any) =>
            typeof u === 'object' &&
            u !== null &&
            ((u._id || u.id) !== myId)
        ) as User;
      }
      if (otherUser?.status === 'online') {
        return 'online';
      }
      return 'offline';
    }
  };

  return (
    <div className={`h-16 border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} px-4 flex items-center justify-between flex-shrink-0 shadow-sm`}>
      <div className="flex items-center">
        {isMobile && (
          <button
            onClick={onBackClick}
            className={`mr-3 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        <div 
          className="relative cursor-pointer"
          onClick={() => {
            if (chat.isGroupChat && chat.group && typeof chat.group === 'object') {
              navigate(`/profile/group/${chat.group._id}`);
            } else {
              // Find the other user in the chat
              const otherUser = chat.participants.find((p: any) => 
                typeof p === 'object' && p !== null && p.id !== (currentUser as any)?.id
              );
              if (otherUser && typeof otherUser === 'object') {
                navigate(`/profile/user/${otherUser._id}`);
              }
            }
          }}
        >
          <Avatar
            src={displayAvatar}
            alt={displayName}
            name={displayName}
            size="md"
          />
          {/* Only show online dot for one-to-one chats */}
          {!chat.isGroupChat && isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          )}
        </div>
        
        <div 
          className="ml-3 cursor-pointer"
          onClick={() => {
            if (chat.isGroupChat && chat.group && typeof chat.group === 'object') {
              navigate(`/profile/group/${chat.group._id}`);
            } else {
              // Find the other user in the chat
              const otherUser = chat.participants.find((p: any) => 
                typeof p === 'object' && p !== null && p.id !== (currentUser as any)?.id
              );
              if (otherUser && typeof otherUser === 'object') {
                navigate(`/profile/user/${otherUser._id}`);
              }
            }
          }}
        >
          <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{displayName}</h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{getStatusText()}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <Phone className="w-5 h-5" />
        </button>
        <button className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <Video className="w-5 h-5" />
        </button>
        <ChatHeaderMenu
          chat={chat}
          isDark={isDark}
          onAddToFavourites={onAddToFavourites}
          onClearChat={onClearChat}
          onDeleteChat={onDeleteChat}
          onBlockUser={onBlockUser}
          onViewInfo={onViewInfo}
        />
      </div>
    </div>
  );
};

export default ChatHeader;