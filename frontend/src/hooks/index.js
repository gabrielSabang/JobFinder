import { useQuery } from '@tanstack/react-query';
import api from '../config/axios';
import { API_URLS } from '../config/api';

export function usePosts(page = 1, limit = 9) {
  return useQuery({
    queryKey: ['posts', 'all', page, limit],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`${API_URLS.POSTS}/all`, {
        params: { page, limit },
        signal,
      });
      return data;
    },
    staleTime: 30000,
    placeholderData: (prev) => prev,
  });
}

export function usePost(id) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`${API_URLS.POSTS}/${id}`, { signal });
      return data;
    },
    staleTime: 60000,
  });
}

export function useUserPosts(userName, page = 1, limit = 10) {
  return useQuery({
    queryKey: ['posts', 'user', userName, page, limit],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`${API_URLS.POSTS}/user/${userName}`, {
        params: { page, limit },
        signal,
      });
      return data;
    },
    staleTime: 30000,
    placeholderData: (prev) => prev,
  });
}

export function useUserProfile(userName) {
  return useQuery({
    queryKey: ['user', userName],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`${API_URLS.USERS}/${userName}`, { signal });
      return data;
    },
    staleTime: 60000,
  });
}

export function useSearchUsers(query) {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: async ({ signal }) => {
      if (!query || !query.trim()) return { users: [] };
      const { data } = await api.get(`${API_URLS.USERS}`, {
        params: { q: query },
        signal,
      });
      return data;
    },
    enabled: !!query && query.trim().length > 0,
    staleTime: 30000,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users', 'all'],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`${API_URLS.USERS}`, { signal });
      return data;
    },
    staleTime: 30000,
  });
}

export function useMessages(withUserId, page = 1, limit = 50) {
  return useQuery({
    queryKey: ['messages', withUserId, page, limit],
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`${API_URLS.MESSAGES}/${withUserId}`, {
        params: { page, limit },
        signal,
      });
      return data;
    },
    enabled: !!withUserId,
    staleTime: 10000,
    placeholderData: (prev) => prev,
  });
}
