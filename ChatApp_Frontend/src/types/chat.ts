export interface User {
  _id: string;
  id: string; 
  username: string;
  email: string;
  phone: string;
  profileImage: string;
  status: "online" | "offline";
  socketId?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  about?: string;
}

export interface Message {
  id: string; 
  sender: string | User;
  receiver?: string | User;
  chat: string;
  group?: string;
  content: string;
  messageType: "text" | "image" | "file";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  _id: string;
  id: string;
  name: string;
  admin: string | User;
  createdBy?: string | User;
  members: (string | User)[];
  groupImage: string;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: string; 
  roomId: string;
  participants: (string | User)[];
  isGroupChat: boolean;
  group?: Group;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export type FilterType = 'all' | 'unread' | 'favourites' | 'groups';