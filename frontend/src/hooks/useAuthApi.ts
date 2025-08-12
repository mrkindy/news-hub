import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, LoginCredentials, RegisterData } from '../types/auth';
import { authService } from '../services/authService';

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (user) => {
      // Update the current user cache
      queryClient.setQueryData(['currentUser'], user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (user) => {
      // Update the current user cache
      queryClient.setQueryData(['currentUser'], user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
  });
}

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useUserData() {
  return useQuery<User>({
    queryKey: ['userData'],
    queryFn: () => authService.getUserData(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (preferences: Partial<User['preferences']>) => authService.updatePreferences(preferences),
    onSuccess: (updatedPreferences) => {
      // Update the current user cache with new preferences
      const currentUser = queryClient.getQueryData<User>(['currentUser']);
      if (currentUser) {
        queryClient.setQueryData(['currentUser'], {
          ...currentUser,
          preferences: updatedPreferences,
        });
      }
    },
  });
}
