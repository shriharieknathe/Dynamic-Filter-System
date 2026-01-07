import { FormControl, Select, MenuItem, type SelectChangeEvent, Chip, Box, OutlinedInput } from '@mui/material';
import type { FilterValue, FilterOperator } from '../../../types/filters';

interface SelectInputProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  options: string[];
  operator: FilterOperator;
  isMulti?: boolean;
}

export function SelectInput({ value, onChange, options, operator, isMulti = false }: SelectInputProps) {
  const shouldBeMulti = isMulti || operator === 'in' || operator === 'notIn' || operator === 'hasAny' || operator === 'hasAll';

  if (shouldBeMulti) {
    const arrayValue = Array.isArray(value) ? value as string[] : [];

    const handleMultiChange = (event: SelectChangeEvent<string[]>) => {
      const newValue = event.target.value;
      onChange(typeof newValue === 'string' ? newValue.split(',') : newValue);
    };

    return (
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <Select
          multiple
          value={arrayValue}
          onChange={handleMultiChange}
          input={<OutlinedInput />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((val) => (
                <Chip key={val} label={val} size="small" />
              ))}
            </Box>
          )}
          displayEmpty
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  const stringValue = typeof value === 'string' ? value : '';

  const handleSingleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <Select value={stringValue} onChange={handleSingleChange} displayEmpty>
        <MenuItem value="" disabled><em>Select...</em></MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
