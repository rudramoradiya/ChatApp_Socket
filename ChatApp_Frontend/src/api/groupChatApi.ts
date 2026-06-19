import { api, getToken } from "../lib/api-client";
import { Group, User } from "../types/chat";

// Create a new group chat
export const createGroupChat = async (formData: FormData): Promise<any> => {
  const response = await api.post("/chats/group", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

// Get group by ID (for profile viewing)
export const getGroupById = async (groupId: string): Promise<{ group: Group; userRole: 'admin' | 'member' }> => {
  const response = await api.get(`/chats/group/${groupId}`);
  console.log("Group By Id",response.data);
  
  return response.data.data;
};

// Edit group details
export const editGroup = async (
  groupId: string,
  formData: FormData
): Promise<Group> => {
  const response = await api.put(`/chats/group/${groupId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

// Add participants to a group
export const addParticipants = async (
  groupId: string,
  participants: (string | User)[]
): Promise<Group> => {
  const token = getToken();
  const response = await api.put<Group>(
    `/chats/group/${groupId}/add`,
    { users: participants },
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
  );
  return response.data;
};

// Remove a participant from a group
export const removeParticipant = async (
  groupId: string,
  userId: string
): Promise<Group> => {
  const response = await api.put(`/chats/group/${groupId}/remove`, { userId });
  // Backend wraps payload as { status, message, data: <group> }
  // Return the actual group object when available, otherwise fall back to response.data
  return response.data?.data ?? response.data;
};

// Delete group or leave group
export const deleteOrLeaveGroup = async (groupId: string): Promise<any> => {
  const response = await api.delete(`/chats/group/${groupId}`);
  return response.data;
};
