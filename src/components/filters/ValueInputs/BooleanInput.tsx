import { FormControl, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import type { FilterValue } from '../../../types/filters';

interface BooleanInputProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export function BooleanInput({ value, onChange }: BooleanInputProps) {
  const stringValue = value === true || value === 'true' ? 'true' : value === false || value === 'false' ? 'false' : '';

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <Select value={stringValue} onChange={handleChange} displayEmpty>
        <MenuItem value="" disabled><em>Select...</em></MenuItem>
        <MenuItem value="true">Yes</MenuItem>
        <MenuItem value="false">No</MenuItem>
      </Select>
    </FormControl>
  );
}
