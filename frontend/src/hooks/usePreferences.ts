import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { PreferencesRequest } from '../types/auth';
import { Option } from '../types/ui';

export function usePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: PreferencesRequest) => {
      return authService.savePreferences(preferences);
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

// Helper function to convert selected options to simple API format
export function convertOptionsToApiFormat(
  selectedCategories: Option[],
  selectedSources: Option[],
  selectedAuthors: Option[],
  language: string = 'en',
  theme: string = 'light'
): PreferencesRequest {
  return {
    categories: selectedCategories.map(option => option.label),
    sources: selectedSources.map(option => option.label),
    authors: selectedAuthors.map(option => option.label),
    language,
    theme
  };
}
