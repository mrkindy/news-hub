import React from 'react';
import Select, { components, OptionProps, StylesConfig } from 'react-select';
import { LoadingSpinner } from './LoadingSpinner';
import { Option, MultiSelectAutocompleteProps } from '../../types/ui';

const customStyles: StylesConfig<Option, true> = {
  control: (provided) => ({
    ...provided,
    minHeight: '2.5rem',
    borderRadius: '0.5rem',
    borderColor: '#e5e7eb',
    boxShadow: 'none',
    '&:hover': { borderColor: '#a3a3a3' },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#e0e7ff',
    borderRadius: '0.375rem',
    padding: '0 0.5rem',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#6366f1' : state.isFocused ? '#f3f4f6' : undefined,
    color: state.isSelected ? '#fff' : '#111827',
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
  }),
};

const CheckboxOption = (props: OptionProps<Option, true>) => (
  <components.Option {...props}>
    <input
      type="checkbox"
      checked={props.isSelected}
      onChange={() => {}}
      className="mr-2"
    />
    {props.label}
  </components.Option>
);

export const MultiSelectAutocomplete: React.FC<MultiSelectAutocompleteProps> = ({
  label,
  fetchOptions,
  value,
  onChange,
  isLoading = false,
  onInputChange,
}) => {
  const [options, setOptions] = React.useState<Option[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Fetch options when component mounts or when search query changes
  React.useEffect(() => {
    const loadOptions = async () => {
      try {
        const optionsData = await fetchOptions(searchQuery);
        //console.log('Fetched options:', optionsData); // Debug log
        // Use React.startTransition to avoid React warnings in tests
        React.startTransition(() => {
          setOptions(optionsData || []);
        });
      } catch {
        // Error fetching options - silently handled
        React.startTransition(() => {
          setOptions([]);
        });
      }
    };
    
    loadOptions();
  }, [fetchOptions, searchQuery]);

  const handleInputChange = (val: string) => {
    setSearchQuery(val);
    if (onInputChange) onInputChange(val);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Select
        isMulti
        options={options}
        value={value}
        onChange={(newValue) => onChange(Array.isArray(newValue) ? [...newValue] : [])}
        onInputChange={handleInputChange}
        styles={customStyles}
        components={{ Option: CheckboxOption }}
        placeholder={`Search and select ${label.toLowerCase()}...`}
        isLoading={isLoading}
        noOptionsMessage={() => (isLoading ? <LoadingSpinner /> : 'No results found')}
        classNamePrefix="react-select"
        menuPlacement="auto"
        closeMenuOnSelect={false}
        aria-label={label}
      />
    </div>
  );
};
