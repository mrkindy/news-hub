import { Article, Category, NewsFilters } from './news';

// News Components Types
export interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured';
  onCategoryClick?: (category: Category) => void;
}

export interface ArticleListProps {
  articles: Article[];
  isLoading?: boolean;
  emptyMessage?: string;
  showFeatured?: boolean;
  onCategoryClick?: (category: Category) => void;
}

export interface SearchBarProps {
  onSearch: (keyword: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export interface FilterPanelProps {
  filters: NewsFilters;
  onFiltersChange: (filters: Partial<NewsFilters>) => void;
  onClearFilters: () => void;
  isVisible: boolean;
  onToggle: () => void;
}
