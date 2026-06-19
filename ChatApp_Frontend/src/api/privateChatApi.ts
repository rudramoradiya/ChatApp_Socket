import { api } from "../lib/api-client";
import { Chat } from "../types/chat";

// Create a new one-to-one chat
export const createOneToOneChat = async (data: { receiverId: string }): Promise<Chat> => {
  const response = await api.post<any>("/chats/one-to-one", data);
  const payload = response.data?.data || response.data;
  return payload;
};

// Get all chats for the current user
export const getAllChats = async (): Promise<Chat[]> => {
  const response = await api.get("/chats");
  if (Array.isArray(response.data)) {
    return response.data;
  } else if (Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return [];
};

// Get a single chat by ID
export const getSingleChat = async (chatId: string): Promise<Chat> => {
  const response = await api.get<Chat>(`/chats/${chatId}`);
  return response.data;
};

// Delete a chat by ID
export const deleteChat = async (chatId: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/chats/${chatId}`);
  return response.data;
};
