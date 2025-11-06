import { apiClient } from './api';

export interface ContactRequestPayload {
  fullName?: string;
  email: string;
  orderNumber?: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  leadId?: number;
  contactId?: number;
}

export const sendContactRequest = async (
  payload: ContactRequestPayload,
): Promise<ContactResponse> => {
  const { data } = await apiClient.post<ContactResponse>('/contact', payload);
  return data;
};
