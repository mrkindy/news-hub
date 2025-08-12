import { useQuery } from '@tanstack/react-query';
import { Option } from '../types/ui';
import { useCategories, useSources, useAuthors } from './useFilterOptions';

export function useCategoryOptions(query: string = '') {
  const { data: categories = [], isLoading, isError } = useCategories(query);
  const categoriesMap = categories.map(category => ({
    label: category.name,
    value: category.id.toString()
  }));
  //console.log('Fetched category options:', categoriesMap,categories); // Debug log
  //return {data: categoriesMap,isLoading:false};
  return useQuery<Option[]>({
    queryKey: ['category-options', query],
    queryFn: () => {
      return categoriesMap;
    },
    enabled: !isLoading && !isError,
    staleTime: 1000 * 60 * 10,
  });
}

export function useSourceOptions(query: string = '') {
  const { data: sources = [], isLoading, isError } = useSources(query);
  const sourcesMap = sources.map(source => ({
    label: source.name,
    value: source.id.toString()
  }));
  return useQuery<Option[]>({
    queryKey: ['source-options', query],
    queryFn: () => {
      return sourcesMap;
    },
    enabled: !isLoading && !isError,
    staleTime: 1000 * 60 * 10,
  });
}

export function useAuthorOptions(query: string = '') {
  const { data: authors = [], isLoading, isError } = useAuthors(query);
  
  const authorsMap = authors.map(author => ({
    label: author.name,
    value: author.id.toString()
  }));

  return useQuery<Option[]>({
    queryKey: ['author-options', query],
    queryFn: () => {
      return authorsMap;
    },
    enabled: !isLoading && !isError,
    staleTime: 1000 * 60 * 10,
  });
}
