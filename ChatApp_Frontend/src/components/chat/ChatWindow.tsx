import React from 'react';
import { Chat, Message } from '../../types/chat';
import ChatHeader from './ChatHeader';
import MessageList from '../message/MessageList';
import MessageInput from '../message/MessageInput';

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  isDark: boolean;
  isMobile: boolean;
  onSendMessage: (content: string) => void;
  onBackClick: () => void;
  onAddToFavourites: () => void;
  onClearChat: () => void;
  onDeleteChat: () => void;
  onBlockUser: () => void;
  onViewInfo: () => void;
  messagesContainerRef?: React.RefObject<HTMLDivElement>;
  onMessagesScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  loadingMore?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, messages, isDark, isMobile, onSendMessage, onBackClick, onAddToFavourites, onClearChat, onDeleteChat, onBlockUser, onViewInfo, messagesContainerRef, onMessagesScroll, loadingMore }) => {
  return (
    <div className={`flex-1 flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-50'} relative`}>
      <ChatHeader 
        chat={chat} 
        isDark={isDark} 
        isMobile={isMobile}
        onBackClick={onBackClick}
        onAddToFavourites={onAddToFavourites}
        onClearChat={onClearChat}
        onDeleteChat={onDeleteChat}
        onBlockUser={onBlockUser}
        onViewInfo={onViewInfo}
      />
      <MessageList chat={chat} messages={messages} isDark={isDark} containerRef={messagesContainerRef} onScroll={onMessagesScroll} loadingMore={loadingMore} />
      {chat && (
        <MessageInput
          onSendMessage={onSendMessage}
          isDark={isDark}
          chatId={(chat as any)._id}
        />
      )}
    </div>
  );
};

export default ChatWindow;