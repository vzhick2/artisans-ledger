'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';
import { useDebounce } from 'use-debounce';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  defaultValue?: string;
  showFilters?: boolean;
  filters?: Array<{
    key: string;
    label: string;
    value: string;
  }>;
  onFilterChange?: (filters: Array<{ key: string; value: string }>) => void;
}

export function SearchBar({ 
  placeholder = "Search...", 
  onSearch, 
  defaultValue = "",
  showFilters = false,
  filters = [],
  onFilterChange 
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [activeFilters, setActiveFilters] = useState<Array<{ key: string; value: string }>>([]);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  const handleFilterToggle = useCallback((filter: { key: string; label: string; value: string }) => {
    setActiveFilters(prev => {
      const existingIndex = prev.findIndex(f => f.key === filter.key && f.value === filter.value);
      let newFilters;
      
      if (existingIndex >= 0) {
        // Remove filter
        newFilters = prev.filter((_, index) => index !== existingIndex);
      } else {
        // Add filter
        newFilters = [...prev, { key: filter.key, value: filter.value }];
      }
      
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
      
      return newFilters;
    });
  }, [onFilterChange]);

  const clearAllFilters = useCallback(() => {
    setActiveFilters([]);
    if (onFilterChange) {
      onFilterChange([]);
    }
  }, [onFilterChange]);

  const isFilterActive = useCallback((filter: { key: string; value: string }) => {
    return activeFilters.some(f => f.key === filter.key && f.value === filter.value);
  }, [activeFilters]);

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-20"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              handleClear();
            }
          }}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1 h-7 w-7 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Filter className="h-3 w-3" />
            <span>Filters:</span>
          </div>
          {filters.map((filter) => (
            <Badge
              key={`${filter.key}-${filter.value}`}
              variant={isFilterActive(filter) ? "default" : "outline"}
              className="cursor-pointer hover:bg-accent"
              onClick={() => handleFilterToggle(filter)}
            >
              {filter.label}
            </Badge>
          ))}
          {activeFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-6 px-2 text-xs text-muted-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active:</span>
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="gap-1"
            >
              {filters.find(f => f.key === filter.key && f.value === filter.value)?.label}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterToggle({
                  key: filter.key,
                  label: filters.find(f => f.key === filter.key && f.value === filter.value)?.label || '',
                  value: filter.value
                })}
                className="h-3 w-3 p-0 hover:bg-transparent"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// Global search context for cross-page search
interface GlobalSearchContextValue {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  recentSearches: string[];
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
}

// Simple implementation without context for now
export function useGlobalSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  const addRecentSearch = useCallback((term: string) => {
    if (term.trim() && !recentSearches.includes(term)) {
      setRecentSearches(prev => [term, ...prev.slice(0, 4)]);
    }
  }, [recentSearches]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const searchInSection = useCallback((section: string, query: string) => {
    addRecentSearch(query);
    router.push(`/${section}?search=${encodeURIComponent(query)}`);
  }, [router, addRecentSearch]);

  return {
    searchTerm,
    setSearchTerm,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    searchInSection
  };
}
