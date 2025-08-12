export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  author: Author;
  source: Source
  category: Category;
  publishedAt: string;
  imageUrl: string;
  url: string;
}

export interface Source {
  id: string;
  name: string;
  slug: string;
}
export interface Author {
  id: string;
  name: string;
  slug: string;
}
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface NewsFilters {
  keyword: string;
  category: Category | null;
  source: Source | null;
  author: Author | null;
  dateFrom: string;
  dateTo: string;
}

export interface NewsState {
  articles: Article[];
  filteredArticles: Article[];
  isLoading: boolean;
  error: string | null;
  filters: NewsFilters;
}