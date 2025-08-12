import React, { useMemo } from 'react';
import { Layout } from '../components/layout/Layout';
import { PreferencesForm } from '../components/preferences/PreferencesForm';
import { ArticleList } from '../components/news/ArticleList';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useContext';
import { useInfinitePersonalizedFeed } from '../hooks/useNewsQueries';
import { Card } from '../components/ui/Card';
import { User, Mail, Calendar } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { useLanguage } from '../hooks/useLanguage';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Prepare preferences for the query
  const preferences = useMemo(() => {
    if (!user || !user.preferences) return { categories: [], sources: [], authors: [] };
    
    return {
      categories: user.preferences.categories?.map(c => c.id) || [],
      sources: user.preferences.sources?.map(s => s.id) || [],
      authors: user.preferences.authors?.map(a => a.id) || []
    };
  }, [user]);

  const hasPreferences = preferences.categories.length > 0 || 
                        preferences.sources.length > 0 || 
                        preferences.authors.length > 0;

  // Fetch personalized feed using React Query infinite
  const {
    data: personalizedData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfinitePersonalizedFeed(
    preferences,
    10,
    !!user && hasPreferences
  );

  // Flatten all pages into a single array of articles
  const personalizedArticles = personalizedData?.pages
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? personalizedData.pages.flatMap((page: any) => page.data || page.articles || [])
    : [];

  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('profile.loginToContinue')}
            </h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.first_name} {user.last_name}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600 mt-2">
                  <div className="flex items-center space-x-1">
                    <Mail size={16} />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{t('profile.memberSince')} {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Preferences Section */}
        <div className="mb-8">
          <PreferencesForm />
        </div>

        {/* Personalized Feed Section */}
        {hasPreferences && (
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('profile.personalizedFeedTitle')}
              </h2>
              <p className="text-gray-600">
                {t('profile.personalizedFeedDescription')}
              </p>
            </div>
            
            <ArticleList
              articles={personalizedArticles}
              isLoading={isLoading}
              onCategoryClick={() => {}}
              emptyMessage="No articles found matching your preferences. Try adjusting your settings above."
              showFeatured={false}
            />
            
            {/* Load More Button for Personalized Feed */}
            {hasNextPage && (
              <div className="text-center mt-6">
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
        )}

        {/* Empty State */}
        {!hasPreferences && (
          <Card className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('profile.personalizedFeed')}
              </h3>
              <p className="text-gray-600">
                {t('profile.personalizedFeedDescriptionParagraph')}
              </p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};
