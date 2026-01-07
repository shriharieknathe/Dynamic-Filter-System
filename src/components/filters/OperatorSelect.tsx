import { FormControl, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import type { FilterOperator, FieldType, OperatorConfig } from '../../types/filters';
import { operatorsByFieldType } from '../../config/operators';

interface OperatorSelectProps {
  fieldType: FieldType;
  value: FilterOperator;
  onChange: (operator: FilterOperator) => void;
}

export function OperatorSelect({ fieldType, value, onChange }: OperatorSelectProps) {
  const operators: OperatorConfig[] = operatorsByFieldType[fieldType] || [];

  const handleChange = (event: SelectChangeEvent<FilterOperator>) => {
    onChange(event.target.value as FilterOperator);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 160 }}>
      <Select value={value} onChange={handleChange}>
        {operators.map((op) => (
          <MenuItem key={op.value} value={op.value}>
            {op.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
