import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchableDropdown } from '../../src/components/ui/SearchableDropdown';

const mockOptions = [
  { id: '1', name: 'Option 1', slug: 'option-1', count: 5 },
  { id: '2', name: 'Option 2', slug: 'option-2', count: 10 },
];

const defaultProps = {
  value: '',
  onChange: jest.fn(),
  onSearch: jest.fn(),
  placeholder: 'Select an option',
  label: 'Test Label',
};

describe('SearchableDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing when options is undefined', () => {
    render(
      <SearchableDropdown
        {...defaultProps}
        options={undefined}
        searchResults={undefined}
      />
    );
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('should render without crashing when options is empty array', () => {
    render(
      <SearchableDropdown
        {...defaultProps}
        options={[]}
        searchResults={[]}
      />
    );
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('should display options when provided', () => {
    render(
      <SearchableDropdown
        {...defaultProps}
        options={mockOptions}
        searchResults={[]}
      />
    );
    
    // Click to open dropdown
    fireEvent.click(screen.getByText('Select an option'));
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should handle option selection', () => {
    const mockOnChange = jest.fn();
    
    render(
      <SearchableDropdown
        {...defaultProps}
        options={mockOptions}
        searchResults={[]}
        onChange={mockOnChange}
      />
    );
    
    // Click to open dropdown
    fireEvent.click(screen.getByText('Select an option'));
    
    // Click on an option
    fireEvent.click(screen.getByText('Option 1'));
    
    expect(mockOnChange).toHaveBeenCalledWith('1');
  });

  it('should handle search functionality', () => {
    const mockOnSearch = jest.fn();
    
    render(
      <SearchableDropdown
        {...defaultProps}
        options={mockOptions}
        searchResults={[]}
        onSearch={mockOnSearch}
      />
    );
    
    // Click to open dropdown
    fireEvent.click(screen.getByText('Select an option'));
    
    // Type in search input
    const searchInput = screen.getByPlaceholderText('Search test label...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('should display selected option when value matches an option', () => {
    render(
      <SearchableDropdown
        {...defaultProps}
        value="1"
        options={mockOptions}
        searchResults={[]}
      />
    );
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });
});
