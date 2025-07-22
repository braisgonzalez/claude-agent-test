import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onClear,
  debounceMs = 300,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(internalValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, onChange, debounceMs]);

  const handleClear = () => {
    setInternalValue('');
    onChange('');
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      
      <input
        type="text"
        className="form-input pl-10 pr-10"
        placeholder={placeholder}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
      />
      
      {internalValue && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 dark:hover:text-gray-300"
          onClick={handleClear}
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  );
};