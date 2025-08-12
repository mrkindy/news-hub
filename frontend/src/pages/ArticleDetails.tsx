import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, ExternalLink } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { ArticleCard } from '../components/news/ArticleCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { useArticleDetail } from '../hooks/useNewsApi';
import { formatDate } from '../utils/helpers';
import { useLanguage } from '../hooks/useLanguage';

export const ArticleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useArticleDetail(id || '');
  const article = data?.article;
  const relatedArticles = data?.relatedArticles || [];
  const { t } = useLanguage();

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-4">{error?.message || 'Article not found'}</div>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft size={16} className="mr-2" />
              {t('common.goBack')}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span>{t('common.back')}</span>
          </Button>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <span className={'inline-flex px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800'}>
              <Tag size={14} className="mr-1" />
              {article.category.name}
            </span>
            <span className="text-sm text-gray-500">{article.source.name}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-1">
              <User size={16} />
              <span>{t('articles.by')} {article.author.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>
        </header>

        {/* Article Image */}
        <div className="mb-8">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="text-gray-800 leading-relaxed space-y-6">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-lg leading-8">
                {paragraph}
              </p>
            ))}
            
            {/* Extended content for better reading experience */}
            <p className="text-lg leading-8">
              {article.content}
            </p>
            
          </div>
        </div>

        {/* External Link */}
        <div className="mb-12 p-6 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('articles.readFullStory')}</h3>
              <p className="text-gray-600 text-sm">
                {t('articles.continueReading')}
              </p>
            </div>
            <Button
              onClick={() => window.open(article.url, '_blank')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <span>{t('articles.viewSource')}</span>
              <ExternalLink size={16} />
            </Button>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('articles.relatedArticles')} {article.category.name}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard 
                  key={relatedArticle.id} 
                  article={relatedArticle}
                  onCategoryClick={() => {}} // Empty function since we're already filtered
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
};