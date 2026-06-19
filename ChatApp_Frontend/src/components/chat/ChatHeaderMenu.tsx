import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Star, Trash2, MessageSquareX, UserX, Info, Search, Archive } from 'lucide-react';
import { Chat } from '../../types/chat';

interface ChatHeaderMenuProps {
  chat: Chat;
  isDark: boolean;
  onAddToFavourites: () => void;
  onClearChat: () => void;
  onDeleteChat: () => void;
  onBlockUser: () => void;
  onViewInfo: () => void;
}

const ChatHeaderMenu: React.FC<ChatHeaderMenuProps> = ({
  chat,
  isDark,
  onAddToFavourites,
  onClearChat,
  onDeleteChat,
  onBlockUser,
  onViewInfo
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      icon: Info,
      label: chat.type === 'group' ? 'Group info' : 'Contact info',
      action: onViewInfo,
      color: 'text-blue-500'
    },
    {
      icon: Search,
      label: 'Search',
      action: () => console.log('Search in chat'),
      color: isDark ? 'text-gray-300' : 'text-gray-700'
    },
    {
      icon: Star,
      label: chat.isFavourite ? 'Remove from favourites' : 'Add to favourites',
      action: onAddToFavourites,
      color: chat.isFavourite ? 'text-yellow-500' : (isDark ? 'text-gray-300' : 'text-gray-700')
    },
    {
      icon: Archive,
      label: 'Archive chat',
      action: () => console.log('Archive chat'),
      color: isDark ? 'text-gray-300' : 'text-gray-700'
    },
    {
      icon: MessageSquareX,
      label: 'Clear chat',
      action: onClearChat,
      color: 'text-orange-500'
    },
    {
      icon: Trash2,
      label: 'Delete chat',
      action: onDeleteChat,
      color: 'text-red-500'
    }
  ];

  // Add block option only for individual chats
  if (chat.type === 'individual') {
    menuItems.push({
      icon: UserX,
      label: 'Block user',
      action: onBlockUser,
      color: 'text-red-600'
    });
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl border z-50 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  index === menuItems.length - 1 || (chat.type === 'individual' && index === menuItems.length - 2)
                    ? 'border-t border-gray-200 dark:border-gray-600 mt-1 pt-3'
                    : ''
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${item.color}`} />
                <span className={`text-sm font-medium ${
                  item.color.includes('red') || item.color.includes('orange')
                    ? item.color
                    : isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeaderMenu;