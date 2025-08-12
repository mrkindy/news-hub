import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDate, truncateText } from '../../utils/helpers';
import { ArticleCardProps } from '../../types/news-components';
import { useLanguage } from '../../hooks/useLanguage';

export const ArticleCard: React.FC<ArticleCardProps> = React.memo(({ 
  article, 
  variant = 'default',
  onCategoryClick
}) => {
  const isFeatured = variant === 'featured';
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCategoryClick) {
      onCategoryClick(article.category);
    }
  };

  const handleImageClick = () => {
    navigate(`/article/${article.id}`);
  };
  if (isFeatured) {
    return (
      <Card variant="elevated" className="overflow-hidden group">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-48 w-full object-cover md:h-full md:w-48 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
              src={article.imageUrl}
              alt={article.title}
              loading="lazy"
              onClick={handleImageClick}
            />
          </div>
          <div className="p-6 flex flex-col justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <button
                  onClick={handleCategoryClick}
                  className="inline-flex px-2 py-1 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105 cursor-pointer bg-purple-100 text-purple-800"
                >
                  {article.category.name}
                </button>
                <span className="text-sm text-gray-500">{article.source.name}</span>
              </div>
              
              <Link to={`/article/${article.id}`}>
                <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </h2>
              </Link>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {truncateText(article.description, 200)}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <User size={16} />
                  <span>{article.author.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link to={`/article/${article.id}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <span>{t('common.readMore')}</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(article.url, '_blank')}
                  className="flex items-center space-x-1"
                >
                  <ExternalLink size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden group h-full flex flex-col">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          src={article.imageUrl}
          alt={article.title}
          loading="lazy"
          onClick={handleImageClick}
        />
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={handleCategoryClick}
            className="inline-flex px-2 py-1 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105 cursor-pointer bg-purple-100 text-purple-800"
          >
            {article.category.name}
          </button>
          <span className="text-xs text-gray-500">{article.source.name}</span>
        </div>
        
        <Link to={`/article/${article.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2 flex-1">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {truncateText(article.description, 120)}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            <div className="flex items-center space-x-1 mb-1">
              <User size={12} />
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <Link to={`/article/${article.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-800 p-1"
              >
                {t('common.read')}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(article.url, '_blank')}
              className="text-gray-600 hover:text-gray-800 p-1"
            >
              <ExternalLink size={16} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
});