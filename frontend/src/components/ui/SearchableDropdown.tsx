import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { FilterOption } from '../../types/filter-options';

interface SearchableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: FilterOption[];
  searchResults?: FilterOption[];
  onSearch: (query: string) => void;
  placeholder: string;
  label: string;
  isSearching?: boolean;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  value,
  onChange,
  options = [],
  searchResults = [],
  onSearch,
  placeholder,
  label,
  isSearching = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const selectedOption = options?.find(option => option.id === value) || 
                         searchResults?.find(option => option.id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const handleOptionSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const displayOptions = searchQuery ? searchResults : options;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Selected value display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown size={20} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Search input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {/* Clear option */}
            <button
              type="button"
              onClick={() => handleOptionSelect('')}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 text-sm"
            >
              <span className="text-gray-500">All {label}</span>
            </button>

            {/* Loading state */}
            {isSearching && searchQuery && (
              <div className="px-3 py-2 text-gray-500 text-sm">
                Searching...
              </div>
            )}

            {/* Options */}
            {displayOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionSelect(option.id)}
                className={`w-full px-3 py-2 text-left hover:bg-gray-50 text-sm flex items-center justify-between ${
                  value === option.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                <span>{option.name}</span>
                <span className="text-xs text-gray-500">({option.count})</span>
              </button>
            ))}

            {/* No results */}
            {displayOptions.length === 0 && !isSearching && (
              <div className="px-3 py-2 text-gray-500 text-sm">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
