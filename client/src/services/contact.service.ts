import type {
  SendContacRequestResponse,
  SendContactRequestPayload,
} from '@/types/models/contact.model';

import { apiClient } from './api';

export const sendContactRequest = async (
  payload: SendContactRequestPayload,
): Promise<SendContacRequestResponse> => {
  const { data } = await apiClient.post<SendContacRequestResponse>('/contact', payload);
  return data;
};
