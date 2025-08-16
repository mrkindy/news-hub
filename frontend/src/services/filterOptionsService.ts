import { API_ENDPOINTS, fetcher } from "../utils/endpoints";
import {
  FilterOptionsResponse,
  SearchFilterRequest,
  SearchFilterResponse,
  FilterOption,
} from "../types/filter-options";

class FilterOptionsService {
  /**
   * Fetches categories
   */
  async getCategories(
    query?: string
  ): Promise<{ success: boolean; data: { categories: FilterOption[] } }> {
    const url = query
      ? `${API_ENDPOINTS.CATEGORIES}?q=${encodeURIComponent(query)}`
      : API_ENDPOINTS.CATEGORIES;
    const response = (await fetcher(url, "GET")) as {
      success: boolean;
      data: { categories: FilterOption[] };
    };
    return response;
  }

  /**
   * Fetches sources
   */
  async getSources(
    query?: string
  ): Promise<{ success: boolean; data: { sources: FilterOption[] } }> {
    const url = query
      ? `${API_ENDPOINTS.SOURCES}?q=${encodeURIComponent(query)}`
      : API_ENDPOINTS.SOURCES;
    const response = (await fetcher(url, "GET")) as {
      success: boolean;
      data: { sources: FilterOption[]};
    };
    return response;
  }

  /**
   * Fetches authors
   */
  async getAuthors(
    query?: string
  ): Promise<{ success: boolean; data: { authors: FilterOption[] } }> {
    const url = query
      ? `${API_ENDPOINTS.AUTHORS}?q=${encodeURIComponent(query)}`
      : API_ENDPOINTS.AUTHORS;
    const response = (await fetcher(url, "GET")) as {
      success: boolean;
      data: { authors: FilterOption[] };
    };
    return response;
  }

  /**
   * Fetches initial filter options (categories, sources, authors) - Legacy method
   */
  async getFilterOptions(): Promise<FilterOptionsResponse> {
    const [categoriesResponse, sourcesResponse, authorsResponse] =
      await Promise.all([
        this.getCategories(),
        this.getSources(),
        this.getAuthors(),
      ]);

    return {
      success: true,
      data: {
        categories: categoriesResponse.data.categories,
        sources: sourcesResponse.data.sources,
        authors: authorsResponse.data.authors,
      },
    };
  }

  /**
   * Searches for filter options based on query
   */
  async searchFilterOptions(
    request: SearchFilterRequest
  ): Promise<SearchFilterResponse> {
    let response;

    switch (request.type) {
      case "categories":
        response = await this.getCategories(request.query);
        break;
      case "sources":
        response = await this.getSources(request.query);
        break;
      case "authors":
        response = await this.getAuthors(request.query);
        break;
      default:
        throw new Error(`Unknown filter type: ${request.type}`);
    }

    let filterOptions: FilterOption[] = [];
    switch (request.type) {
      case "categories":
        if ("categories" in response.data) {
          filterOptions = response.data.categories;
        }
        break;
      case "sources":
        if ("sources" in response.data) {
          filterOptions = response.data.sources;
        }
        break;
      case "authors":
        if ("authors" in response.data) {
          filterOptions = response.data.authors;
        }
        break;
    }

    return {
      success: response.success,
      data: filterOptions,
    };
  }
}

export const filterOptionsService = new FilterOptionsService();
