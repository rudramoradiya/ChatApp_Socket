import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar } from '../ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { editGroup } from '../../api/groupChatApi';
import { Group } from '../../types/chat';

interface EditGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  isDark: boolean;
}

const EditGroupDialog: React.FC<EditGroupDialogProps> = ({
  isOpen,
  onClose,
  group,
  isDark
}) => {
  const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;
  const [groupName, setGroupName] = useState(group.name);
  const [groupImageFile, setGroupImageFile] = useState<File | null>(null);
  const [groupImagePreview, setGroupImagePreview] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGroupImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setGroupImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setGroupImageFile(null);
    setGroupImagePreview('');
  };

  const handleSave = async () => {
    if (!groupName.trim()) {
      toast.error('Group name is required');
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('name', groupName.trim());
      if (groupImageFile) {
        formData.append('groupImage', groupImageFile);
      }

      await editGroup(group._id, formData);
      toast.success('Group updated successfully');
      onClose();
      // Refresh the page to get updated data
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update group');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setGroupName(group.name);
    setGroupImageFile(null);
    setGroupImagePreview('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
            Edit Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Group Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center overflow-hidden`}>
                <Avatar
                  src={groupImagePreview || (group.groupImage ? (group.groupImage.startsWith('http') ? group.groupImage : `${BACKEND_BASE_URL}${group.groupImage}`) : undefined)}
                  alt={groupName || "Group"}
                  name={groupName || "Group"}
                  size="2xl"
                  className="w-24 h-24"
                />
              </div>
              <label className="absolute -bottom-1 -right-1 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors cursor-pointer">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {groupImagePreview && (
            <div className="flex justify-center">
              <Button
                onClick={handleRemoveImage}
                variant="outline"
                size="sm"
              >
                Remove Image
              </Button>
            </div>
          )}

          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="groupName" className={isDark ? 'text-white' : 'text-gray-700'}>
              Group Name
            </Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className={isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!groupName.trim() || saving}
              className="flex-1"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditGroupDialog; 