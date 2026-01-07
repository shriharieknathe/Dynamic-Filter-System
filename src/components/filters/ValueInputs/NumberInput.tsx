import { TextField, Box } from '@mui/material';
import type { FilterValue, FilterOperator } from '../../../types/filters';

interface NumberInputProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  operator: FilterOperator;
  isCurrency?: boolean;
}

export function NumberInput({ value, onChange, operator, isCurrency = false }: NumberInputProps) {
  const isBetween = operator === 'between';

  if (isBetween) {
    const rangeValue = Array.isArray(value) ? value : ['', ''];
    const [min, max] = rangeValue;

    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          type="number"
          value={min ?? ''}
          onChange={(e) => onChange([e.target.value, max ?? ''])}
          placeholder={isCurrency ? 'Min $' : 'Min'}
          sx={{ width: 100 }}
          slotProps={{ htmlInput: { step: isCurrency ? 1000 : 1 } }}
        />
        <span>to</span>
        <TextField
          size="small"
          type="number"
          value={max ?? ''}
          onChange={(e) => onChange([min ?? '', e.target.value])}
          placeholder={isCurrency ? 'Max $' : 'Max'}
          sx={{ width: 100 }}
          slotProps={{ htmlInput: { step: isCurrency ? 1000 : 1 } }}
        />
      </Box>
    );
  }

  const numValue = typeof value === 'number' ? value : (typeof value === 'string' ? value : '');

  return (
    <TextField
      size="small"
      type="number"
      value={numValue}
      onChange={(e) => onChange(e.target.value)}
      placeholder={isCurrency ? 'Enter amount...' : 'Enter number...'}
      sx={{ minWidth: 150 }}
      slotProps={{ htmlInput: { step: isCurrency ? 1000 : 1 } }}
    />
  );
}
