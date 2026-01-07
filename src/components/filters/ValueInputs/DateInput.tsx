import { Box, TextField } from '@mui/material';
import type { FilterValue, FilterOperator } from '../../../types/filters';

interface DateInputProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  operator: FilterOperator;
}

export function DateInput({ value, onChange, operator }: DateInputProps) {
  const isBetween = operator === 'between';

  if (isBetween) {
    const rangeValue = Array.isArray(value) ? value : ['', ''];
    const [start, end] = rangeValue;

    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          type="date"
          value={start ?? ''}
          onChange={(e) => onChange([e.target.value, end ?? ''])}
          sx={{ width: 150 }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <span>to</span>
        <TextField
          size="small"
          type="date"
          value={end ?? ''}
          onChange={(e) => onChange([start ?? '', e.target.value])}
          sx={{ width: 150 }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>
    );
  }

  const dateValue = typeof value === 'string' ? value : '';

  return (
    <TextField
      size="small"
      type="date"
      value={dateValue}
      onChange={(e) => onChange(e.target.value)}
      sx={{ minWidth: 150 }}
      slotProps={{ inputLabel: { shrink: true } }}
    />
  );
}
