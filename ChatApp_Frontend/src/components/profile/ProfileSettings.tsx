import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, Edit3, Check, X, LogOut, Bell, Shield, Palette, HelpCircle, Archive, Trash2, Key, User2 } from 'lucide-react';
import { getUser, updateUser } from '../../api/userApi';
import { User } from '../../types/chat';
import { toast } from 'sonner';
import { Avatar } from "../ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface ProfileSettingsProps {
  isDark: boolean;
  onBackClick: () => void;
  onLogout: () => void;
}
const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL; 

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isDark, onBackClick, onLogout }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempPhone, setTempPhone] = useState('');
  const [tempAbout, setTempAbout] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userData = await getUser();
        setUser(userData);
        setTempUsername(userData.username || '');
        setTempEmail(userData.email || '');
        setTempPhone(userData.phone || '');
        setTempAbout(userData.about || '');
        setRemoveImage(false);
        setSelectedImage(null);
      } catch (error:any) {
        toast.error(error?.response?.data?.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handlePhotoButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      setRemoveImage(false);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedImage(null);
    setRemoveImage(true);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    if (user) {
      setTempUsername(user.username || '');
      setTempEmail(user.email || '');
      setTempPhone(user.phone || '');
      setTempAbout(user.about || '');
      setRemoveImage(false);
      setSelectedImage(null);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    const formData = new FormData();
    formData.append('username', tempUsername);
    formData.append('email', tempEmail);
    formData.append('phone', tempPhone);
    formData.append('about', tempAbout);
    if (selectedImage) {
      formData.append('profileImage', selectedImage);
    } else if (removeImage) {
      formData.append('profileImage', '');
    }
    try {
      const response = await updateUser(user.id, formData);
      setUser(response);
      toast.success('Profile updated!');
      setRemoveImage(false);
      setSelectedImage(null);
      setEditMode(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    }
  };

  const getProfileImageUrl = () => {
    if (selectedImage) return URL.createObjectURL(selectedImage);
    if (user?.profileImage && !removeImage) {
      const imgPath = user.profileImage.startsWith('/') ? user.profileImage.slice(1) : user.profileImage;
      return `${BACKEND_BASE_URL}/${imgPath}`;
    }
    return '/default-avatar.png';
  };

  if (loading) {
    return <div className={`flex-1 flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>Loading profile...</div>;
  }

  return (
    <div className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent relative`}>
      {/* Header */}
      <div className={`h-16 border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} px-4 flex items-center shadow-sm sticky top-0 z-10`}>
        <button
          onClick={onBackClick}
          className={`mr-3 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
      </div>
      {/* Profile Card (clickable) */}
      <div className="max-w-2xl mx-auto p-6 pb-0 flex flex-col items-center">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <div
              className={`cursor-pointer w-full flex flex-col items-center gap-2 py-8 rounded-2xl shadow-lg border transition-all duration-200 ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-100 hover:bg-gray-100'}`}
              style={{ boxShadow: isDark ? '0 2px 16px 0 rgba(0,0,0,0.4)' : '0 2px 16px 0 rgba(0,0,0,0.08)' }}
            >
              <div className="relative group">
                <Avatar
                  src={getProfileImageUrl()}
                  alt={tempUsername}
                  name={tempUsername}
                  size="2xl"
                  className="shadow-md"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Camera className="w-8 h-8 text-white" />
                  <span className="ml-2 text-white font-medium hidden sm:inline">Edit</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.username}</div>
                <div className={`text-base mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user?.about || 'Hey there! I am using ChatApp.'}</div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">Edit Profile</DialogTitle>
              <div className="text-sm text-gray-400 text-center mb-2">Update your profile details</div>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="relative group mb-2">
                <Avatar
                  src={getProfileImageUrl()}
                  alt={tempUsername}
                  name={tempUsername}
                  size="2xl"
                  className="shadow-lg"
                />
                <button 
                  onClick={handlePhotoButtonClick}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  type="button"
                  title="Change profile photo"
                >
                  <Camera className="w-8 h-8 text-white" />
                  <span className="ml-2 text-white font-medium hidden sm:inline">Change</span>
                </button>
                {((user?.profileImage && !removeImage) || selectedImage) && (
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute -bottom-2 -left-2 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors"
                    type="button"
                    title="Remove profile photo"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-500">Your name</label>
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={e => setTempUsername(e.target.value)}
                    placeholder="Username"
                    className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                  <div className="text-xs text-gray-400 mt-1">This is not your username or PIN. This name will be visible to your contacts.</div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-500">About</label>
                  <textarea
                    value={tempAbout}
                    onChange={e => setTempAbout(e.target.value)}
                    rows={2}
                    placeholder="About"
                    className={`w-full px-3 py-2 rounded-lg border resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 w-full mt-4">
                <button
                  onClick={async () => { await handleSaveProfile(); setDialogOpen(false); }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
                >
                  <Check className="w-4 h-4" /> Save
                </button>
                <button
                  onClick={() => { handleCancelEdit(); setDialogOpen(false); }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Divider */}
      <div className="max-w-2xl mx-auto px-4"><div className="border-t border-gray-200 dark:border-gray-700 my-6" /></div>
      {/* Settings List */}
      <div className="max-w-2xl mx-auto p-4 pt-0">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}> 
          <ul className="divide-y divide-gray-700 dark:divide-gray-700">
            <li className="flex items-center gap-4 px-6 py-5 hover:bg-gray-700/60 transition-colors cursor-pointer">
              <Key className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-semibold text-white">Account</div>
                <div className="text-sm text-gray-400">Security notifications, account info</div>
              </div>
            </li>
            <li className="flex items-center gap-4 px-6 py-5 hover:bg-gray-700/60 transition-colors cursor-pointer">
              <Shield className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-semibold text-white">Privacy</div>
                <div className="text-sm text-gray-400">Blocked contacts, disappearing messages</div>
              </div>
            </li>
            <li className="flex items-center gap-4 px-6 py-5 hover:bg-gray-700/60 transition-colors cursor-pointer">
              <Palette className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-semibold text-white">Chats</div>
                <div className="text-sm text-gray-400">Theme, wallpaper, chat settings</div>
              </div>
            </li>
            <li className="flex items-center gap-4 px-6 py-5 hover:bg-gray-700/60 transition-colors cursor-pointer">
              <Bell className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-semibold text-white">Notifications</div>
                <div className="text-sm text-gray-400">Message notifications</div>
              </div>
            </li>
            
            <li className="flex items-center gap-4 px-6 py-5 hover:bg-gray-700/60 transition-colors cursor-pointer">
              <HelpCircle className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-semibold text-white">Help</div>
                <div className="text-sm text-gray-400">Help center, contact us, privacy policy</div>
              </div>
            </li>
            <li>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-4 px-6 py-5 hover:bg-red-200/80 transition-colors cursor-pointer focus:outline-none"
                aria-label="Log out"
                title="Sign out of your account"
                type="button"
              >
                <LogOut className="w-6 h-6 text-red-500 group-hover:text-white transition-colors" />
                <span className="font-semibold text-red-500 group-hover:text-white text-lg">Log out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;