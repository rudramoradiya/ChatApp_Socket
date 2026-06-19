import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../api/userApi';
import { createOneToOneChat } from '../../api/privateChatApi';
import { X } from 'lucide-react';
import { User } from '../../types/chat';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Avatar } from "../ui/avatar";

interface NewChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (user: User) => void;
  isDark: boolean;
}

const NewChatDialog: React.FC<NewChatDialogProps> = ({ isOpen, onClose, onCreateChat, isDark }) => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  //fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllUsers();
        let usersArray: User[] = [];
        if (Array.isArray(data)) {
          usersArray = data;
        } else if (Array.isArray(data.users)) {
          usersArray = data.users;
        } else if (Array.isArray(data.data)) {
          usersArray = data.data;
        }
        usersArray = usersArray.map(u => ({
          ...u,
          id: u.id || u._id,
        }));
        // Filter out the logged-in user
        if (currentUser) {
          usersArray = usersArray.filter(u => u.id !== currentUser.id);
        }
        setUsers(usersArray);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUsers();
    } else {
      setUsers([]);
      setSelectedUser(null);
      setError(null);
      setCreateError(null);
    }
  }, [isOpen]);

  //create chat
  const handleCreateChat = async () => {
    if (!selectedUser) return;
    setCreating(true);
    setCreateError(null);
    try {
      await createOneToOneChat({ receiverId: selectedUser.id });
      setSelectedUser(null);
      onClose();
      onCreateChat(selectedUser);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create chat');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Chat</DialogTitle>
          <DialogDescription className="sr-only">Choose a user to start a new one-to-one chat.</DialogDescription>
        </DialogHeader>
        <DialogDescription className="sr-only">Edit group settings</DialogDescription>
        {loading ? (
          <div className="py-8 text-center">Loading users...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : (
          <div className="max-h-64 overflow-y-auto mb-4 scrollbar-none">
            {users.length === 0 ? (
              <div className="text-center py-8">No users found</div>
            ) : (
              <ul>
                {Array.isArray(users) && users.map((user, index) => (
                  <li
                    key={String(user.id || (user as any)._id || index)}
                    className={`flex items-center px-3 py-2 rounded-lg cursor-pointer mb-1 transition-colors ${
                      selectedUser?.id === user.id
                        ? isDark
                          ? 'bg-green-900/40 text-green-200'
                          : 'bg-green-100 text-green-900'
                        : isDark
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <Avatar
                      src={user.profileImage || undefined}
                      alt={user.username}
                      name={user.username}
                      size="md"
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-300">{user.email}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <button
          className={`w-full py-2 rounded-lg font-semibold transition-colors ${
            selectedUser && !creating
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!selectedUser || creating}
          onClick={handleCreateChat}
        >
          {creating ? 'Starting...' : 'Start Chat'}
        </button>
        {createError && (
          <div className="text-center text-red-500 mt-2">{createError}</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog; 