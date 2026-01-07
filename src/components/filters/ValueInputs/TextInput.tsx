import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import type { FilterValue } from '../../../types/filters';
import { useDebounce } from '../../../hooks/useDebounce';

interface TextInputProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  placeholder?: string;
}

export function TextInput({ value, onChange, placeholder = 'Enter value...' }: TextInputProps) {
  const externalValue = typeof value === 'string' ? value : '';
  const [localValue, setLocalValue] = useState(externalValue);
  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => {
    setLocalValue(externalValue);
  }, [externalValue]);

  useEffect(() => {
    if (debouncedValue !== externalValue) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, externalValue, onChange]);

  return (
    <TextField
      size="small"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      fullWidth
      sx={{ minWidth: 150 }}
    />
  );
}
