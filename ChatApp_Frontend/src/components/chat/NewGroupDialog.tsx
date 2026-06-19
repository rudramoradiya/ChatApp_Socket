import React, { useState, useEffect } from 'react';
import { X, Users, Camera, Check } from 'lucide-react';
import { getAllUsers } from '../../api/userApi';
import { createGroupChat } from '../../api/groupChatApi';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Avatar } from "../ui/avatar";

interface NewGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (chat: any) => void; 
  isDark: boolean;
}

const NewGroupDialog: React.FC<NewGroupDialogProps> = ({ isOpen, onClose, onCreateGroup, isDark }) => {
  const { user: currentUser } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [step, setStep] = useState<'users' | 'details'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [groupImageFile, setGroupImageFile] = useState<File | null>(null);
  const [groupImagePreview, setGroupImagePreview] = useState<string>("");
  const [createdGroup, setCreatedGroup] = useState<any | null>(null);
  const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

//fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllUsers();
        let usersArray: any[] = [];
        if (Array.isArray(data)) {
          usersArray = data;
        } else if (Array.isArray(data.users)) {
          usersArray = data.users;
        } else if (Array.isArray(data.data)) {
          usersArray = data.data;
        }
        usersArray = usersArray.map(u => ({ ...u, id: u.id || u._id }));
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
      setSelectedUsers([]);
      setError(null);
      setGroupName('');
      setStep('users');
      setCreateError(null);
      setGroupImageFile(null);
      setGroupImagePreview("");
    }
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setGroupImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setGroupImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setGroupImagePreview("");
    }
  };

//create group
   const handleCreate = async () => {
    if (groupName.trim() && selectedUsers.length >= 1) {
      setCreating(true);
      setCreateError(null);
      try {
        const formData = new FormData();
        formData.append("name", groupName.trim());
        formData.append("users", JSON.stringify(selectedUsers));
        if (groupImageFile) {
          formData.append("groupImage", groupImageFile);
        }
        const chat = await createGroupChat(formData);
        setGroupName("");
        setSelectedUsers([]);
        setStep("users");
        setGroupImageFile(null);
        setGroupImagePreview("");
        setCreatedGroup(chat); // Show preview dialog
        onClose();
        onCreateGroup(chat); // Pass the full chat object
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to create group');
      } finally {
        setCreating(false);
      }
    }
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleNext = () => {
    if (selectedUsers.length >= 1) {
      setStep('details');
    }
  };
  
  const handleBack = () => {
    if (step === 'details') {
      setStep('users');
    } else {
      setGroupName('');
      setSelectedUsers([]);
      onClose();
    }
  };

  return (
    <>
      {/* Group Created Dialog */}
      <Dialog open={!!createdGroup} onOpenChange={() => setCreatedGroup(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Group Created</DialogTitle>
            <DialogDescription className="sr-only">This dialog confirms the new group creation and shows the group details.</DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-6 flex flex-col items-center">
            <Avatar
              src={createdGroup?.group?.groupImage ? (createdGroup.group.groupImage.startsWith('http') ? createdGroup.group.groupImage : `${BACKEND_BASE_URL}${createdGroup.group.groupImage}`) : undefined}
              alt={createdGroup?.group?.name}
              name={createdGroup?.group?.name}
              size="2xl"
              className="mb-4"
            />
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{createdGroup?.group?.name}</h2>
            <div className="w-full">
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Members</h3>
              <div className="flex flex-col gap-3">
                {createdGroup?.group?.members?.map((member: any) => (
                  <div key={member._id || member.id} className="flex items-center gap-3">
                    <Avatar
                      src={member.profileImage ? (member.profileImage.startsWith('http') ? member.profileImage : `${BACKEND_BASE_URL}${member.profileImage}`) : undefined}
                      alt={member.username}
                      name={member.username}
                      size="md"
                    />
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{member.username}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main New Group Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogTitle className="sr-only">New Group Dialog</DialogTitle>
          <DialogDescription className="sr-only">Create a new group by selecting participants and entering group details.</DialogDescription>
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className={`mr-3 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{step === 'users' ? 'Add Group Participants' : 'New Group'}</h3>
            </div>
            {step === 'users' && selectedUsers.length > 0 && (
              <button
                onClick={handleNext}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Next
              </button>
            )}
          </div>

          {step === 'users' ? (
            <>
              {/* Selected Count */}
              {selectedUsers.length > 0 && (
                <div className={`px-4 py-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedUsers.length} participant{selectedUsers.length !== 1 ? 's' : ''} selected</p>
                </div>
              )}
              {/* User List */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {loading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8">No users found</div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserToggle(user.id)}
                      className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedUsers.includes(user.id) ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                    >
                      <div className="relative">
                        <Avatar
                          src={user.profileImage || undefined}
                          alt={user.username}
                          name={user.username}
                          size="lg"
                        />
                        {selectedUsers.includes(user.id) && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.username}</h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="p-6 space-y-6">
              {step === 'details' && (
                <div className="flex justify-center">
                  <div className="relative">
                    <div className={`w-24 h-24 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center overflow-hidden`}>
                      <Avatar
                        src={groupImagePreview || undefined}
                        alt="Group"
                        name={groupName || "Group"}
                        size="2xl"
                      />
                    </div>
                    <label className="absolute -bottom-1 -right-1 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors cursor-pointer">
                      <Camera className="w-4 h-4" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
              )}
              {/* Group Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                />
              </div>
              {/* Selected Participants */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Participants ({selectedUsers.length})</label>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map(userId => {
                    const user = users.find(u => u.id === userId);
                    return user ? (
                      <div key={userId} className={`flex items-center space-x-2 px-3 py-1 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}> <Avatar src={user.profileImage || undefined} alt={user.username} name={user.username} size="sm" /> <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.username}</span> </div>
                  ) : null;
                })}
              </div>
            </div>
            {/* Create Button */}
            <button
              onClick={handleCreate}
              disabled={!groupName.trim() || creating}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? 'Creating...' : 'Create Group'}
            </button>
            {createError && (
              <div className="text-center text-red-500 mt-2">{createError}</div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};

export default NewGroupDialog;