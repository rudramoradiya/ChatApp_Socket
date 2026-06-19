// This component displays the chat interface for a selected chat conversation
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getSingleChat } from "../../api/privateChatApi";
import { getMessages } from "../../api/messageApi";
import ChatWindow from "../../components/chat/ChatWindow";
import { Chat, Message } from "../../types/chat";
import socket from "../../socket/socket";
import { useTheme } from "@/contexts/ThemeContext";

const ChatPage = () => {
  const { chatId } = useParams();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Fetch more messages (pagination)
  const fetchMoreMessages = async () => {
    if (!chatId || loadingMore || !hasMore || messages.length === 0) return;
    setLoadingMore(true);
    const oldest = messages[0]?.createdAt;
    try {
      const more = await getMessages(chatId, { before: oldest, limit: 20 });
      if (more.length < 20) setHasMore(false);
      setMessages((prev) => [...more, ...prev]);
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle scroll to top
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop === 0 && hasMore && !loadingMore) {
      fetchMoreMessages();
    }
  };

  useEffect(() => {
    if (!chatId) return;
    socket.emit("join-room", { roomId: chatId });
    setLoading(true);
    const fetchChatData = async () => {
      try {
        const [chatData, messagesData] = await Promise.all([
          getSingleChat(chatId),
          getMessages(chatId),
        ]);
        const chatObj =
          chatData && typeof chatData === "object" && "data" in chatData
            ? (chatData as any).data?.chat
            : chatData;
        setChat(chatObj);
        setMessages(messagesData);
      } catch (error) {
        console.error("Failed to fetch chat or messages:", error);
        setChat(null);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChatData();
  }, [chatId]);

  if (loading) return <div>Loading chat...</div>;
  if (!chat) return <div>Select a chat to start messaging</div>;

  return (
    <ChatWindow
      chat={chat}
      messages={messages}
      isDark={isDark}
      isMobile={false}
      onSendMessage={() => {}}
      onBackClick={() => {}}
      onAddToFavourites={() => {}}
      onClearChat={() => {}}
      onDeleteChat={() => {}}
      onBlockUser={() => {}}
      onViewInfo={() => {
        if (chat) {
          if (
            chat.isGroupChat &&
            chat.group &&
            typeof chat.group === "object"
          ) {
            navigate(`/profile/group/${chat.group._id}`);
          } else {
            // Find the other user in the chat
            const otherUser = chat.participants.find(
              (p: any) =>
                typeof p === "object" &&
                p !== null &&
                p.id !== (chat as any).currentUserId
            );
            if (otherUser && typeof otherUser === "object") {
              navigate(`/profile/user/${otherUser._id}`);
            }
          }
        }
      }}
      messagesContainerRef={messagesContainerRef}
      onMessagesScroll={handleScroll}
      loadingMore={loadingMore}
    />
  );
};

export default ChatPage;
