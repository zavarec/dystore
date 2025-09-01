import { apiClient } from '@/services/api';

export const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

export default fetcher;
