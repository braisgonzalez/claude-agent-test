import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Clock, ArrowRight, Users, Building2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  searchInData, 
  getSuggestions, 
  mockRecentSearches, 
  type SearchResult, 
  type SearchSuggestion 
} from '../../data/mockSearchData';

interface SearchDropdownProps {
  className?: string;
  placeholder?: string;
  isMobile?: boolean;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  className = '',
  placeholder = 'Search customers, users...',
  isMobile = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches] = useState<string[]>(mockRecentSearches);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const searchResults = searchInData(searchQuery);
      const searchSuggestions = getSuggestions(searchQuery);
      
      setResults(searchResults);
      setSuggestions(searchSuggestions);
      setIsLoading(false);
    }, 300);
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      debouncedSearch(value);
    } else {
      setResults([]);
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Handle recent search click
  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    debouncedSearch(searchTerm);
    inputRef.current?.focus();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    debouncedSearch(suggestion.text);
    inputRef.current?.focus();
  };

  // Get icon for result type
  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'customer':
        return <Building2 className="w-4 h-4" />;
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'page':
        return <FileText className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const showContent = query.length > 0 || recentSearches.length > 0;

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          className={`
            form-input pl-10 pr-4 py-2 text-sm bg-white/50 dark:bg-gray-800/50 
            border-gray-200/50 dark:border-gray-600/50 transition-all duration-200
            focus:bg-white dark:focus:bg-gray-800 focus:border-blue-300 dark:focus:border-blue-500
            ${isMobile ? 'w-full' : 'w-64'}
          `}
        />
      </div>

      {/* Search Dropdown */}
      {isOpen && showContent && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 py-4 z-50 max-h-96 overflow-y-auto">
          
          {/* Loading State */}
          {isLoading && (
            <div className="px-4 py-6 text-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Searching...</p>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && results.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">
                Results
              </h4>
              <div className="space-y-1">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    to={result.url}
                    className="flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="text-gray-400 dark:text-gray-500">
                        {result.icon ? (
                          <span className="text-base">{result.icon}</span>
                        ) : (
                          getResultIcon(result.type)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {result.title}
                        </p>
                        {result.subtitle && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {result.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {!isLoading && suggestions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">
                Suggestions
              </h4>
              <div className="space-y-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center space-x-3">
                      <Search className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {suggestion.text}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {suggestion.category}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {!isLoading && query.length === 0 && recentSearches.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">
                Recent Searches
              </h4>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-900 dark:text-white">
                        {search}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && query.length > 0 && results.length === 0 && suggestions.length === 0 && (
            <div className="px-4 py-6 text-center">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No results found for "{query}"
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Try searching for customers, users, or pages
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};