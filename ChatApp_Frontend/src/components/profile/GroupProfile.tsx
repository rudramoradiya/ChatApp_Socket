import React, { useState, useEffect } from 'react';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Users, 
  Crown, 
  UserPlus, 
  Trash2, 
  LogOut,
  Edit
} from 'lucide-react';
import { Group } from '../../types/chat';
import { AuthUser } from '../../types/auth';
import { toast } from 'sonner';
import { 
  removeParticipant, 
  deleteOrLeaveGroup, 
} from '../../api/groupChatApi';
import AddMembersDialog from './AddMembersDialog';
import EditGroupDialog from './EditGroupDialog';

interface GroupProfileProps {
  group: Group;
  currentUser: AuthUser | null;
  userRole: 'admin' | 'member' | null;
  isDark: boolean;
}

const GroupProfile: React.FC<GroupProfileProps> = ({ 
  group, 
  currentUser, 
  userRole, 
  isDark 
}) => {
  const BACKEND_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [membersState, setMembersState] = useState<any[]>(Array.isArray(group.members) ? group.members : []);

  useEffect(() => {
    setMembersState(Array.isArray(group.members) ? group.members : []);
  }, [group.members]);
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      setLoading(true);
      const resAny: any = await removeParticipant(group._id, userId);
      toast.success('Member removed successfully');
      // Update local members state immediately
      setMembersState(prev => prev.filter(m => {
        const id = typeof m === 'object' ? (m.id || m._id) : m;
        return id?.toString() !== userId?.toString();
      }));
      // If API returned updated group, sync to it as well. Accept multiple shapes.
      const updatedMembers =
        (Array.isArray(resAny?.members) ? resAny.members : undefined) ??
        (Array.isArray(resAny?.data?.members) ? resAny.data.members : undefined) ??
        (Array.isArray(resAny?.data) ? resAny.data : undefined) ??
        (Array.isArray(resAny) ? resAny : undefined);

      if (Array.isArray(updatedMembers)) {
        setMembersState(updatedMembers);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;
    
    try {
      setLoading(true);
      await deleteOrLeaveGroup(group._id);
      toast.success('Left group successfully');
      // Navigate back or to home
      window.history.back();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to leave group');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) return;
    
    try {
      setLoading(true);
      await deleteOrLeaveGroup(group._id);
      toast.success('Group deleted successfully');
      // Navigate back or to home
      window.history.back();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete group');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = userRole === 'admin';
  const adminUser = typeof group.admin === 'object' ? group.admin : null;
  // Local members state for immediate UI updates after removal
  // `membersState` is synced from `group.members` via useEffect above

  return (
    <div className="p-6 space-y-6">
      {/* Group Header */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar
            src={group.groupImage ? (group.groupImage.startsWith('http') ? group.groupImage : `${BACKEND_BASE_URL}${group.groupImage}`) : undefined}
            alt={group.name}
            name={group.name}
            size="2xl"
            className="w-24 h-24"
          />
          {isAdmin && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <Crown className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {group.name}
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Created on {formatDate(group.createdAt)}
          </p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Users className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {membersState.length} members
            </span>
          </div>
        </div>
      </div>

      {/* Admin Information */}
      {adminUser && (
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Crown className="w-5 h-5 text-yellow-500" />
              <span>Group Admin</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <Avatar
                src={adminUser.profileImage ? (adminUser.profileImage.startsWith('http') ? adminUser.profileImage : `${BACKEND_BASE_URL}${adminUser.profileImage}`) : undefined}
                alt={adminUser.username}
                name={adminUser.username}
                size="md"
              />
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {adminUser.username}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {adminUser.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members List */}
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center space-x-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Users className="w-5 h-5" />
              <span>Members ({membersState.length})</span>
            </CardTitle>
            {isAdmin && (
              <Button
                onClick={() => setShowAddMembers(true)}
                size="sm"
                variant="outline"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Members
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {membersState.map((member: any) => {
              const memberUser = typeof member === 'object' ? member : null;
              const memberId = memberUser ? (memberUser.id || memberUser._id) : member;
              const showRemove = String(memberId) !== String(currentUser?.id);

              return (
                <div key={memberId || member} className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={memberUser?.profileImage ? (memberUser.profileImage.startsWith('http') ? memberUser.profileImage : `${BACKEND_BASE_URL}${memberUser.profileImage}`) : undefined}
                      alt={memberUser?.username || 'Member'}
                      name={memberUser?.username || 'Member'}
                      size="md"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {memberUser?.username || 'Unknown'}
                        </p>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {memberUser?.email || 'No email'}
                      </p>
                    </div>
                  </div>

                  {showRemove && (
                    <button
                      onClick={() => handleRemoveMember(String(memberId))}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors z-10"
                      title="Remove member"
                      disabled={loading}
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex space-x-3">
        {isAdmin ? (
          <>
            <Button
              onClick={() => setShowEditGroup(true)}
              variant="outline"
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Group
            </Button>
            <Button
              onClick={handleDeleteGroup}
              variant="destructive"
              className="flex-1"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Group
            </Button>
          </>
        ) : (
          <Button
            onClick={handleLeaveGroup}
            variant="destructive"
            className="flex-1"
            disabled={loading}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Leave Group
          </Button>
        )}
      </div>

      {/* Add Members Dialog */}
      {showAddMembers && (
        <AddMembersDialog
          isOpen={showAddMembers}
          onClose={() => setShowAddMembers(false)}
          groupId={group._id}
          existingMembers={membersState.map((m: any) => (typeof m === 'object' ? (m.id || m._id) : m))}
          isDark={isDark}
        />
      )}

      {/* Edit Group Dialog */}
      {showEditGroup && (
        <EditGroupDialog
          isOpen={showEditGroup}
          onClose={() => setShowEditGroup(false)}
          group={group}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default GroupProfile; 