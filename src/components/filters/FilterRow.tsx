import { Box, FormControl, Select, MenuItem, IconButton, type SelectChangeEvent } from '@mui/material';
import { X } from 'lucide-react';
import type { FilterCondition, FilterOperator, FilterValue, FieldConfig } from '../../types/filters';
import { employeeFieldConfigs, fieldConfigMap } from '../../config/fieldConfig';
import { OperatorSelect } from './OperatorSelect';
import { ValueInput } from './ValueInputs';

interface FilterRowProps {
  filter: FilterCondition;
  onFieldChange: (field: string) => void;
  onOperatorChange: (operator: FilterOperator) => void;
  onValueChange: (value: FilterValue) => void;
  onRemove: () => void;
}

export function FilterRow({
  filter,
  onFieldChange,
  onOperatorChange,
  onValueChange,
  onRemove,
}: FilterRowProps) {
  const fieldConfig: FieldConfig | undefined = fieldConfigMap[filter.field];

  const handleFieldChange = (event: SelectChangeEvent<string>) => {
    onFieldChange(event.target.value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        flexWrap: 'wrap',
      }}
    >
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <Select value={filter.field} onChange={handleFieldChange}>
          {employeeFieldConfigs.map((config) => (
            <MenuItem key={config.field} value={config.field}>
              {config.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {fieldConfig && (
        <OperatorSelect
          fieldType={fieldConfig.type}
          value={filter.operator}
          onChange={onOperatorChange}
        />
      )}

      {fieldConfig && (
        <ValueInput
          fieldConfig={fieldConfig}
          value={filter.value}
          operator={filter.operator}
          onChange={onValueChange}
        />
      )}

      <IconButton
        size="small"
        onClick={onRemove}
        sx={{
          color: 'error.main',
          ml: 'auto',
          '&:hover': { backgroundColor: 'error.dark', color: 'error.contrastText' },
        }}
      >
        <X size={18} />
      </IconButton>
    </Box>
  );
}
