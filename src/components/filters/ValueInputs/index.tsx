import type { FilterValue, FilterOperator, FieldConfig } from '../../../types/filters';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { DateInput } from './DateInput';
import { BooleanInput } from './BooleanInput';
import { SelectInput } from './SelectInput';

interface ValueInputProps {
  fieldConfig: FieldConfig;
  value: FilterValue;
  operator: FilterOperator;
  onChange: (value: FilterValue) => void;
}

export function ValueInput({ fieldConfig, value, operator, onChange }: ValueInputProps) {
  const { type, options = [] } = fieldConfig;

  switch (type) {
    case 'text':
      return <TextInput value={value} onChange={onChange} />;
    case 'number':
      return <NumberInput value={value} onChange={onChange} operator={operator} />;
    case 'currency':
      return <NumberInput value={value} onChange={onChange} operator={operator} isCurrency />;
    case 'date':
      return <DateInput value={value} onChange={onChange} operator={operator} />;
    case 'boolean':
      return <BooleanInput value={value} onChange={onChange} />;
    case 'singleSelect':
      return <SelectInput value={value} onChange={onChange} options={options} operator={operator} />;
    case 'multiSelect':
      return <SelectInput value={value} onChange={onChange} options={options} operator={operator} isMulti />;
    case 'array':
      if (operator === 'hasAny' || operator === 'hasAll') {
        return <SelectInput value={value} onChange={onChange} options={options} operator={operator} isMulti />;
      }
      return <TextInput value={value} onChange={onChange} placeholder="Enter skill..." />;
    default:
      return <TextInput value={value} onChange={onChange} />;
  }
}

export { TextInput } from './TextInput';
export { NumberInput } from './NumberInput';
export { DateInput } from './DateInput';
export { BooleanInput } from './BooleanInput';
export { SelectInput } from './SelectInput';
