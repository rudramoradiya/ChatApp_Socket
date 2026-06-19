import { Chat, User, Message } from '../types/chat';

export const currentUser: User = {
  id: 'current-user',
  name: 'You',
  avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  status: 'online',
  about: 'Hey there! I am using WhatsApp.'
};

export const users: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online'
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'offline',
    lastSeen: 'last seen today at 2:30 PM'
  },
  {
    id: '3',
    name: 'Carol Davis',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'away'
  },
  {
    id: '4',
    name: 'David Wilson',
    avatar: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    status: 'online'
  }
];

const messages: Message[] = [
  {
    id: '1',
    senderId: '1',
    content: 'Hey! How are you doing?',
    timestamp: new Date(2024, 0, 15, 10, 30),
    type: 'text',
    isRead: true
  },
  {
    id: '2',
    senderId: 'current-user',
    content: 'I\'m doing great! Thanks for asking. How about you?',
    timestamp: new Date(2024, 0, 15, 10, 32),
    type: 'text',
    isRead: true
  },
  {
    id: '3',
    senderId: '1',
    content: 'All good here! Working on some exciting projects.',
    timestamp: new Date(2024, 0, 15, 10, 35),
    type: 'text',
    isRead: false
  }
];

export const chats: Chat[] = [
  {
    id: '1',
    type: 'individual',
    name: 'Alice Johnson',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    participants: [users[0]],
    messages: messages,
    lastMessage: messages[messages.length - 1],
    unreadCount: 1,
    isPinned: true,
    isFavourite: true,
    isOnline: true
  },
  {
    id: '2',
    type: 'individual',
    name: 'Bob Smith',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    participants: [users[1]],
    messages: [],
    unreadCount: 3,
    isPinned: false,
    isFavourite: false,
    isOnline: false
  },
  {
    id: '3',
    type: 'group',
    name: 'Team Project',
    avatar: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    participants: [users[0], users[2], users[3]],
    messages: [],
    unreadCount: 0,
    isPinned: false,
    isFavourite: true,
    isOnline: true
  },
  {
    id: '4',
    type: 'individual',
    name: 'Carol Davis',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    participants: [users[2]],
    messages: [],
    unreadCount: 0,
    isPinned: false,
    isFavourite: false,
    isOnline: false
  },
  {
    id: '5',
    type: 'individual',
    name: 'David Wilson',
    avatar: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    participants: [users[3]],
    messages: [],
    unreadCount: 2,
    isPinned: false,
    isFavourite: false,
    isOnline: true
  }
];