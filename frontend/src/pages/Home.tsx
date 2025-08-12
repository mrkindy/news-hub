import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { SearchBar } from '../components/news/SearchBar';
import { FilterPanel } from '../components/news/FilterPanel';
import { ArticleList } from '../components/news/ArticleList';
import { Button } from '../components/ui/Button';
import { useCurrentUser } from '../hooks/useAuthApi';
import { useLanguage } from '../hooks/useLanguage';
import { useArticleData } from '../hooks/useArticleData';
import { Category, NewsFilters } from '../types/news';

export const Home: React.FC = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<NewsFilters>({
    keyword: '',
    category: null,
    source: null,
    author: null,
    dateFrom: '',
    dateTo: '',
  });

  const { data: user } = useCurrentUser();
  const { t } = useLanguage();
  const { articles, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useArticleData(filters, user || null);

  const handleSearch = (keyword: string) => {
    setFilters(prev => ({ ...prev, keyword }));
  };

  const handleFiltersChange = (newFilters: Partial<NewsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      keyword: '',
      category: null,
      source: null,
      author: null,
      dateFrom: '',
      dateTo: '',
    });
  };

  const handleCategoryClick = (category: Category) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const toggleFilterPanel = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const showFeatured = !filters.keyword && !filters.category?.id && !filters.source?.id && !filters.author?.id;
  const hasPersonalPreferences = user && (
    user.preferences?.categories.length > 0 || 
    user.preferences?.sources.length > 0 || 
    user.preferences?.authors.length > 0
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('home.heroTitle')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('home.heroDescription')}
            {user ? ` ${t('home.heroDescriptionLoggedIn')}` : ` ${t('home.heroDescriptionLoggedOut')}`}
          </p>
          
          <div className="flex justify-center mb-6">
            <SearchBar 
              onSearch={handleSearch}
              isLoading={isLoading}
              placeholder={t('home.searchPlaceholder')}
            />
          </div>
        </div>

        {/* Filter Panel */}
        <div className="mb-8">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            isVisible={isFilterVisible}
            onToggle={toggleFilterPanel}
          />
        </div>

        {/* Articles List */}
        <ArticleList
          articles={articles}
          isLoading={isLoading}
          onCategoryClick={handleCategoryClick}
          emptyMessage={
            hasPersonalPreferences
              ? t('home.noArticlesPreferences')
              : t('home.noArticlesFound')
          }
          showFeatured={showFeatured}
        />

        {/* Load More Button */}
        {!isLoading && (
          <div className="text-center mt-8">
            <Button
              onClick={() => fetchNextPage()}
              isLoading={isFetchingNextPage}
              disabled={isFetchingNextPage}
              className="px-8 py-3"
            >
              {isFetchingNextPage ? t('common.loading') : t('common.loadMore')}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};