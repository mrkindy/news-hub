import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { DateRangePicker } from '../ui/DateRangePicker';
import { SearchableDropdown } from '../ui/SearchableDropdown';
import { useLanguage } from '../../hooks/useLanguage';
import { useCategories, useSources, useAuthors } from '../../hooks/useFilterOptions';
import { FilterPanelProps } from '../../types/news-components';
import { NewsFilters } from '../../types/news';
import { hasActiveFilters } from '../../utils/filterUtils';

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isVisible,
  onToggle,
}) => {
  const { t } = useLanguage();
  const [searchQueries, setSearchQueries] = useState({ categories: '', sources: '', authors: '' });
  
  // Use individual hooks for each filter type
  const { data: categories, isLoading: loadingCategories, isError: errorCategories } = useCategories();
  const { data: sources, isLoading: loadingSources, isError: errorSources } = useSources();
  const { data: authors, isLoading: loadingAuthors, isError: errorAuthors } = useAuthors();
  
  // For search functionality
  const { data: searchCategories } = useCategories(searchQueries.categories || undefined);
  const { data: searchSources } = useSources(searchQueries.sources || undefined);
  const { data: searchAuthors } = useAuthors(searchQueries.authors || undefined);
  
  const isLoading = loadingCategories || loadingSources || loadingAuthors;
  const isError = errorCategories || errorSources || errorAuthors;
  const hasFilters = hasActiveFilters(filters);

  const handleSelectChange = (key: keyof NewsFilters, value: string) => {
    // Find the selected option to get full object
    if (key === 'category' && categories) {
      const selectedOption = categories.find(cat => cat.id === value);
      onFiltersChange({ [key]: selectedOption || null });
    } else if (key === 'source' && sources) {
      const selectedOption = sources.find(src => src.id === value);
      onFiltersChange({ [key]: selectedOption || null });
    } else if (key === 'author' && authors) {
      const selectedOption = authors.find(auth => auth.id === value);
      onFiltersChange({ [key]: selectedOption || null });
    } else {
      onFiltersChange({ [key]: value || '' });
    }
  };

  const handleSearch = (type: 'categories' | 'sources' | 'authors', query: string) => {
    setSearchQueries(prev => ({ ...prev, [type]: query }));
  };

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    onFiltersChange({
      dateFrom: startDate ? startDate.toISOString().split('T')[0] : '',
      dateTo: endDate ? endDate.toISOString().split('T')[0] : '',
    });
  };

  if (isError) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {t('common.errorLoadingFilters')}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={onToggle}
          className="flex items-center space-x-2"
        >
          <Filter size={20} />
          <span>{t('common.filters')}</span>
          {hasFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {t('common.active')}
            </span>
          )}
        </Button>
        
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            {t('common.clearAll')}
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {isVisible && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h3 className="font-semibold text-gray-900">{t('common.filterArticles')}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-1"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <SearchableDropdown
              value={filters.category?.id || ''}
              onChange={(value) => handleSelectChange('category', value)}
              options={categories || []}
              searchResults={searchCategories || []}
              onSearch={(query) => handleSearch('categories', query)}
              placeholder={t('common.allCategories')}
              label={t('common.category')}
              isSearching={loadingCategories}
            />

            {/* Source Filter */}
            <SearchableDropdown
              value={filters.source?.id || ''}
              onChange={(value) => handleSelectChange('source', value)}
              options={sources || []}
              searchResults={searchSources || []}
              onSearch={(query) => handleSearch('sources', query)}
              placeholder={t('common.allSources')}
              label={t('common.source')}
              isSearching={loadingSources}
            />

            {/* Author Filter */}
            <SearchableDropdown
              value={filters.author?.id || ''}
              onChange={(value) => handleSelectChange('author', value)}
              options={authors || []}
              searchResults={searchAuthors || []}
              onSearch={(query) => handleSearch('authors', query)}
              placeholder={t('common.allAuthors')}
              label={t('common.author')}
              isSearching={loadingAuthors}
            />

            {/* Loading state */}
            {isLoading && (
              <>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </>
            )}

            {/* Date Range Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.dateRange')}
              </label>
              <DateRangePicker
                onRangeChange={handleDateRangeChange}
                initialRange={{
                  from: filters.dateFrom ? new Date(filters.dateFrom) : null,
                  to: filters.dateTo ? new Date(filters.dateTo) : null,
                }}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};