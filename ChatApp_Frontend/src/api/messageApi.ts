import { api } from "../lib/api-client";
import { Message } from "../types/chat";

// Send a message
export const sendMessage = async (data: {
  chatId: string;
  content: string;
  messageType?: "text" | "image" | "file";
  group?: string;
}): Promise<Message> => {
  const response = await api.post<any>("/messages", data); // Use any to access response.data.data
  const msg = response.data.data ? response.data.data : response.data;
  return { ...msg, id: (msg as any)._id || msg.id };
};

// Get all messages for a chat (with pagination)
export const getMessages = async (
  chatId: string,
  options?: { limit?: number; before?: string }
): Promise<Message[]> => {
  const params = new URLSearchParams();
  if (options?.limit) params.append("limit", options.limit.toString());
  if (options?.before) params.append("before", options.before);
  const url = `/messages/${chatId}${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await api.get(url);
  // Map _id to id for frontend compatibility
  return response.data.data.map((msg: any) => ({
    ...msg,
    id: msg._id || msg.id,
  }));
};

// Mark a message as read
export const markMessageRead = async (messageId: string): Promise<Message> => {
  const response = await api.put<Message>(`/messages/${messageId}/read`);
  return response.data;
};
