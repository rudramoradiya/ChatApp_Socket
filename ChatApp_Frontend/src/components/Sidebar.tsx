"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  MessageSquarePlus,
  Menu,
  Settings,
  Users,
} from "lucide-react";
import type { Chat, FilterType, User } from "../types/chat";
import ChatItem from "./chat/ChatItem";
import NewGroupDialog from "./chat/NewGroupDialog";
import NewChatDialog from "./chat/NewChatDialog";
import { getAllChats } from "../api/privateChatApi";
import { toast } from "sonner";
import { Avatar } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "./ui/theme-toggle";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const { isDark } = useTheme();

  // Refactored fetchChats to be reusable
  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await getAllChats();
      setChats(response);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const filterTabs: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
  ];

  // Filtering logic enabled (only 'all' and 'unread' supported)
  const filteredChats = Array.isArray(chats)
    ? chats.filter((chat) => {
        let username = "";
        if (
          Array.isArray(chat.participants) &&
          chat.participants.length > 0 &&
          typeof chat.participants[0] === "object" &&
          chat.participants[0] !== null &&
          "username" in chat.participants[0]
        ) {
          username = (chat.participants[0] as User).username;
        }
        const matchesSearch = username
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        switch (activeFilter) {
          case "unread":
            return (
              matchesSearch &&
              typeof (chat as any).unreadCount === "number" &&
              (chat as any).unreadCount > 0
            );
          default:
            return matchesSearch;
        }
      })
    : [];

  // Get chatId from URL
  const chatId = location.pathname.startsWith("/chat/")
    ? location.pathname.split("/chat/")[1]
    : null;

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <div
          className={`w-16 h-screen ${
            isDark ? "bg-gray-800" : "bg-white"
          } border-r ${
            isDark ? "border-gray-700" : "border-gray-200"
          } flex flex-col items-center py-4 space-y-4`}
        >
          <button
            onClick={onToggleCollapse}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex flex-col space-y-2">
            {chats.map((chat, index) => {
              const chatKey = (chat as any).id || (chat as any)._id || index;
              let displayName = "";
              let displayAvatar = "";

              if (
                chat.isGroupChat &&
                chat.group &&
                typeof chat.group === "object"
              ) {
                displayName = chat.group.name || "Group";
                displayAvatar = chat.group.groupImage || "";
              } else if (
                Array.isArray(chat.participants) &&
                chat.participants.length > 0
              ) {
                const participant = chat.participants[0] as User;
                displayName = participant.username || "Unknown";
                displayAvatar = participant.profileImage || "";
              }

              return (
                <Tooltip key={chatKey}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate(`/chat/${chatKey}`)}
                      className="relative group"
                    >
                      <Avatar
                        src={displayAvatar}
                        alt={displayName}
                        name={displayName}
                        size="md"
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center">
                    {displayName}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          <div className="flex-1"></div>

          <ThemeToggle />

          <button
            onClick={() => navigate("/profile")}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div
        className={`w-80 h-screen ${
          isDark ? "bg-gray-800" : "bg-white"
        } border-r ${
          isDark ? "border-gray-700" : "border-gray-200"
        } flex flex-col shadow-sm`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          } bg-gradient-to-r ${
            isDark ? "from-gray-800 to-gray-700" : "from-white to-gray-50"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h1
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Chats
            </h1>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => navigate("/profile")}
                className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={onToggleCollapse}
                className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white"
              } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div
          className={`px-4 py-3 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          } bg-gradient-to-r ${
            isDark ? "from-gray-800 to-gray-750" : "from-gray-50 to-white"
          }`}
        >
          <div className="flex space-x-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === tab.key
                    ? "bg-green-500 text-white shadow-md"
                    : isDark
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {loading ? (
            <div className="p-8 text-center">Loading chats...</div>
          ) : filteredChats.length > 0 ? (
            filteredChats.map((chat, index) => {
              const chatKey = (chat as any).id || (chat as any)._id || index;
              return (
                <ChatItem
                  key={chatKey}
                  chat={chat}
                  isSelected={chatId === String(chatKey)}
                  onClick={() => navigate(`/chat/${chatKey}`)}
                  isDark={isDark}
                  onProfileClick={(profile) => {
                    if ("groupImage" in profile) {
                      // It's a group
                      navigate(`/profile/group/${profile._id}`);
                    } else {
                      // It's a user
                      navigate(`/profile/user/${profile._id}`);
                    }
                  }}
                />
              );
            })
          ) : (
            <div
              className={`p-8 text-center ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <p>No chats found</p>
            </div>
          )}
        </div>
        {/* New Group and New Chat Button */}
        <div className="absolute bottom-6 right-6 flex flex-col space-y-3">
          <button
            onClick={() => setShowNewGroup(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Users className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowNewChat(true)}
            className="bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <MessageSquarePlus className="w-6 h-6" />
          </button>
        </div>
        {/* New Group Dialog */}
        <NewGroupDialog
          isOpen={showNewGroup}
          onClose={() => setShowNewGroup(false)}
          onCreateGroup={async (chat) => {
            await fetchChats();
            setShowNewGroup(false);
          }}
          isDark={isDark}
        />
        {/* New Chat Dialog */}
        <NewChatDialog
          isOpen={showNewChat}
          onClose={() => setShowNewChat(false)}
          onCreateChat={async () => {
            await fetchChats();
            setShowNewChat(false);
          }}
          isDark={isDark}
        />
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
