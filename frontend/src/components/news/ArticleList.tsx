import React from 'react';
import { ArticleCard } from './ArticleCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ArticleListProps } from '../../types/news-components';
import { useLanguage } from '../../hooks/useLanguage';

export const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  isLoading = false,
  emptyMessage = "No articles found.",
  showFeatured = true,
  onCategoryClick,
}) => {
  const { t } = useLanguage();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">{emptyMessage}</div>
        <p className="text-gray-400">{t('common.tryAdjustingYourSearch')}</p>
      </div>
    );
  }
  
  const [featuredArticle, ...remainingArticles] = articles;

  return (
    <div className="space-y-8">
      {/* Featured Article */}
      {showFeatured && featuredArticle && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('articles.featuredStory')}</h2>
          <ArticleCard 
            article={featuredArticle} 
            variant="featured" 
            onCategoryClick={onCategoryClick}
          />
        </div>
      )}

      {/* Regular Articles Grid */}
      {remainingArticles.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {showFeatured ? t('articles.latestNews') : t('articles.articles')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {remainingArticles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                onCategoryClick={onCategoryClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Show all articles in grid if no featured */}
      {!showFeatured && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              onCategoryClick={onCategoryClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};