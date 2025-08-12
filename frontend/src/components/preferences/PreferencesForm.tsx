import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '../../hooks/useContext';
import { useLanguage } from '../../hooks/useLanguage';
import { MultiSelectAutocomplete } from '../ui/MultiSelectAutocomplete';
import { Option } from '../../types/ui';
import { useCategoryOptions, useSourceOptions, useAuthorOptions } from '../../hooks/useAutocompleteOptions';
import { usePreferences, convertOptionsToApiFormat } from '../../hooks/usePreferences';

export const PreferencesForm: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [categoryQuery, setCategoryQuery] = useState('');
  const [sourceQuery, setSourceQuery] = useState('');
  const [authorQuery, setAuthorQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [selectedSources, setSelectedSources] = useState<Option[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<Option[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Use React Query hooks
  const { data: categoryOptions = [], isLoading: isLoadingCategories } = useCategoryOptions(categoryQuery);
  const { data: sourceOptions = [], isLoading: isLoadingSources } = useSourceOptions(sourceQuery);
  const { data: authorOptions = [], isLoading: isLoadingAuthors } = useAuthorOptions(authorQuery);
  const isLoadingOptions = isLoadingCategories || isLoadingSources || isLoadingAuthors;
  
  // Preferences mutation
  const savePreferencesMutation = usePreferences();

  useEffect(() => {
    // Load from localStorage if no user in context
    if (!user) {
      try {
        const savedUser = localStorage.getItem('newshub_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          if (userData.preferences) {
            setSelectedCategories(userData.preferences.categories?.map((name: string) => ({ 
              label: name, 
              value: name
            })) || []);
            setSelectedSources(userData.preferences.sources?.map((name: string) => ({ 
              label: name, 
              value: name
            })) || []);
            setSelectedAuthors(userData.preferences.authors?.map((name: string) => ({ 
              label: name, 
              value: name
            })) || []);
          }
        }
      } catch {
        // Error loading preferences from localStorage - silently handled
      }
    } else if (user.preferences) {
      // Convert stored preferences to Option format
      setSelectedCategories(user.preferences.categories?.map((name) => ({ 
        label: name, 
        value: name
      })) || []);
      setSelectedSources(user.preferences.sources?.map((name) => ({ 
        label: name, 
        value: name
      })) || []);
      setSelectedAuthors(user.preferences.authors?.map((name) => ({ 
        label: name, 
        value: name
      })) || []);
    }
  }, [user]);

  const handleSave = async () => {
    if (isLoadingOptions || savePreferencesMutation.isPending) return;
    
    setSaveSuccess(false);
    
    try {
      // Convert selected options to API format
      const preferencesData = convertOptionsToApiFormat(
        selectedCategories,
        selectedSources,
        selectedAuthors,
        'en', // You can make this dynamic based on user's language preference
        'light' // You can make this dynamic based on user's theme preference
      );

      // Save to API
      await savePreferencesMutation.mutateAsync(preferencesData);
      
      // Save to localStorage as well
      try {
        const currentUser = localStorage.getItem('newshub_user');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          userData.preferences = preferencesData;
          localStorage.setItem('newshub_user', JSON.stringify(userData));
        } else {
          // Create new user object in localStorage
          const newUserData = {
            preferences: preferencesData
          };
          localStorage.setItem('newshub_user', JSON.stringify(newUserData));
        }
      } catch {
        // Error saving to localStorage - silently handled
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Force a page reload to refresh the user context with new data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch {
      // Error saving preferences - silently handled
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{t('preferences.customizeTitle')}</h2>
        <p className="text-gray-600 mt-2">
          {t('preferences.customizeDescription')}
        </p>
      </div>

      <MultiSelectAutocomplete
        label={t('common.categories')}
        fetchOptions={async () => categoryOptions}
        value={selectedCategories}
        onChange={setSelectedCategories}
        isLoading={isLoadingCategories}
        onInputChange={setCategoryQuery}
      />
      <MultiSelectAutocomplete
        label={t('common.sources')}
        fetchOptions={async () => sourceOptions}
        value={selectedSources}
        onChange={setSelectedSources}
        isLoading={isLoadingSources}
        onInputChange={setSourceQuery}
      />
      <MultiSelectAutocomplete
        label={t('common.authors')}
        fetchOptions={async () => authorOptions}
        value={selectedAuthors}
        onChange={setSelectedAuthors}
        isLoading={isLoadingAuthors}
        onInputChange={setAuthorQuery}
      />

      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSave}
          isLoading={savePreferencesMutation.isPending}
          disabled={isLoadingOptions || savePreferencesMutation.isPending}
          className="flex items-center space-x-2"
        >
          <Save size={20} />
          <span>{savePreferencesMutation.isPending ? t('common.saving') : t('preferences.savePreferences')}</span>
        </Button>
      </div>

      {saveSuccess && (
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle size={20} className="text-green-600" />
            <p className="text-green-800 font-medium">
              {t('preferences.saveSuccess')}
            </p>
          </div>
        </Card>
      )}

      {savePreferencesMutation.isError && (
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-center justify-center space-x-2">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-red-800 font-medium">
              {t('preferences.saveError') || 'Failed to save preferences. Please try again.'}
            </p>
          </div>
        </Card>
      )}

      {(selectedCategories.length > 0 || selectedSources.length > 0 || selectedAuthors.length > 0) && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-blue-800 font-medium">
              {t('preferences.personalizedFeedActive')}
            </p>
            <p className="text-blue-600 text-sm mt-1">
              {t('preferences.canChangeSettings')}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};