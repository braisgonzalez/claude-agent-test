export interface SearchResult {
  id: string;
  type: 'customer' | 'user' | 'page';
  title: string;
  subtitle?: string;
  url: string;
  icon?: string;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  category: string;
}

export const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'customer',
    title: 'Tech Solutions Inc.',
    subtitle: 'Technology • Active Customer',
    url: '/customers/1',
    icon: '🏢',
  },
  {
    id: '2',
    type: 'customer',
    title: 'Acme Corporation',
    subtitle: 'Manufacturing • Prospect',
    url: '/customers/2',
    icon: '🏭',
  },
  {
    id: '3',
    type: 'customer',
    title: 'Global Industries',
    subtitle: 'Consulting • Active Customer',
    url: '/customers/3',
    icon: '🌐',
  },
  {
    id: '4',
    type: 'user',
    title: 'John Doe',
    subtitle: 'Admin • john@company.com',
    url: '/users/1',
    icon: '👤',
  },
  {
    id: '5',
    type: 'user',
    title: 'Sarah Smith',
    subtitle: 'Manager • sarah@company.com',
    url: '/users/2',
    icon: '👤',
  },
  {
    id: '6',
    type: 'page',
    title: 'Dashboard',
    subtitle: 'Overview and metrics',
    url: '/',
    icon: '📊',
  },
  {
    id: '7',
    type: 'page',
    title: 'Customer Reports',
    subtitle: 'Analytics and insights',
    url: '/reports/customers',
    icon: '📈',
  },
];

export const mockSearchSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'active customers', category: 'Filters' },
  { id: '2', text: 'prospect customers', category: 'Filters' },
  { id: '3', text: 'new users', category: 'Filters' },
  { id: '4', text: 'technology companies', category: 'Industries' },
  { id: '5', text: 'consulting firms', category: 'Industries' },
  { id: '6', text: 'customer reports', category: 'Pages' },
  { id: '7', text: 'user management', category: 'Pages' },
  { id: '8', text: 'dashboard analytics', category: 'Features' },
];

export const mockRecentSearches: string[] = [
  'Tech Solutions',
  'active customers',
  'John Doe',
  'customer reports',
  'new users',
];

export const searchInData = (query: string): SearchResult[] => {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return mockSearchResults.filter(result => 
    result.title.toLowerCase().includes(lowercaseQuery) ||
    result.subtitle?.toLowerCase().includes(lowercaseQuery)
  ).slice(0, 6); // Limit to 6 results
};

export const getSuggestions = (query: string): SearchSuggestion[] => {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return mockSearchSuggestions.filter(suggestion => 
    suggestion.text.toLowerCase().includes(lowercaseQuery)
  ).slice(0, 4); // Limit to 4 suggestions
};