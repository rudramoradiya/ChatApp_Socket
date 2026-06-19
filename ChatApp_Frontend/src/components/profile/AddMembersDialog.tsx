import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import { Input } from '../ui/input';
import { Check, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getAllUsers } from '../../api/userApi';
import { addParticipants } from '../../api/groupChatApi';
import { AuthUser } from '../../types/auth';

interface AddMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  existingMembers: string[];
  isDark: boolean;
}

const AddMembersDialog: React.FC<AddMembersDialogProps> = ({
  isOpen,
  onClose,
  groupId,
  existingMembers,
  isDark
}) => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      let allUsers: AuthUser[] = [];
      if (Array.isArray(data)) {
        allUsers = data;
      } else if (Array.isArray((data as any).users)) {
        allUsers = (data as any).users;
      } else if (Array.isArray((data as any).data)) {
        allUsers = (data as any).data;
      } else if (Array.isArray((data as any).data?.users)) {
        allUsers = (data as any).data.users;
      }

      // Filter out users who are already members (safe string comparisons)
      const availableUsers = allUsers.filter((user: AuthUser) => {
        const userId = String((user as any).id ?? (user as any)._id ?? '');
        return !existingMembers.some(em => String(em) === userId);
      });
      setUsers(availableUsers);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const onToggleUser = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddMembers = async () => {
    if (selectedUserIds.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    try {
      setAdding(true);
      await addParticipants(groupId, selectedUserIds);
      toast.success('Members added successfully');
      setSelectedUserIds([]);
      onClose();
      // Refresh the page to get updated data
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add members');
    } finally {
      setAdding(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
            Add Members
          </DialogTitle>
          <DialogDescription className="sr-only">Search and select users to add to the group chat.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
            />
          </div>

          {/* Users List */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {searchTerm ? 'No users found' : 'No users available to add'}
              </p>
            ) : (
              filteredUsers.map((user) => {
                const userId = String((user as any)._id ?? user.id);
                return (
                  <div
                    key={userId}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onToggleUser(userId)}
                  >
                    <div className="relative">
                      <Avatar
                        src={user.profileImage || undefined}
                        alt={user.username}
                        name={user.username}
                        size="md"
                      />
                      {selectedUserIds.includes(userId) && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user.username}
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMembers}
              disabled={selectedUserIds.length === 0 || adding}
              className="flex-1"
            >
              {adding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                `Add ${selectedUserIds.length} Member${selectedUserIds.length !== 1 ? 's' : ''}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersDialog; 