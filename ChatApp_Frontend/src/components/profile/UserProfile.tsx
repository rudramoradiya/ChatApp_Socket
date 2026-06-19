import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { User, Mail, Phone, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { AuthUser } from '../../types/auth';
import { createOneToOneChat } from '../../api/privateChatApi';
import { toast } from 'sonner';

interface UserProfileProps {
  user: AuthUser;
  currentUser: AuthUser | null;
  isDark: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, currentUser, isDark }) => {
  const navigate = useNavigate();
  const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSendMessage = async () => {
    const receiverId = (user as any)?.id || (user as any)?._id;
    if (!receiverId) return;
    setIsCreatingChat(true);

    try {
      const chat = await createOneToOneChat({ receiverId });
      const chatId = (chat as any)?._id || (chat as any)?.id || (chat as any)?.roomId;
      if (chatId) {
        navigate(`/chat/${chatId}`);
      } else {
        throw new Error('Unable to determine chat id');
      }
    } catch (error: any) {
      console.error('Create one-to-one chat failed:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Unable to start chat');
    } finally {
      setIsCreatingChat(false);
    }
  };

  const isOwnProfile = currentUser && currentUser.id === user.id;

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar
            src={user.profileImage ? (user.profileImage.startsWith('http') ? user.profileImage : `${BACKEND_BASE_URL}${user.profileImage}`) : undefined}
            alt={user.username}
            name={user.username}
            size="2xl"
            className="w-24 h-24"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {user.username}
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Member since {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      {/* Profile Information */}
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
        <CardHeader>
          <CardTitle className={`flex items-center space-x-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <User className="w-5 h-5" />
            <span>Profile Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
            </div>
          </div>

          {user.phone && (
            <div className="flex items-center space-x-3">
              <Phone className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Phone</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user.phone}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <Calendar className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Joined</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          {user.about && (
            <div className="flex items-start space-x-3">
              <MessageCircle className={`w-4 h-4 mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>About</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user.about}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      {!isOwnProfile && (
        <div className="flex space-x-3">
          <Button
            className="flex-1"
            variant="default"
            onClick={handleSendMessage}
            disabled={isCreatingChat}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {isCreatingChat ? 'Opening chat...' : 'Send Message'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 