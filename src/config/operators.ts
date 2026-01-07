import type { FieldType, OperatorConfig } from '../types/filters';

export const operatorsByFieldType: Record<FieldType, OperatorConfig[]> = {
  text: [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' },
    { value: 'notContains', label: 'Does not contain' },
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'greaterThan', label: 'Greater than' },
    { value: 'lessThan', label: 'Less than' },
    { value: 'greaterThanOrEqual', label: 'Greater than or equal' },
    { value: 'lessThanOrEqual', label: 'Less than or equal' },
    { value: 'between', label: 'Between' },
  ],
  date: [
    { value: 'before', label: 'Before' },
    { value: 'after', label: 'After' },
    { value: 'between', label: 'Between' },
  ],
  boolean: [
    { value: 'is', label: 'Is' },
  ],
  singleSelect: [
    { value: 'is', label: 'Is' },
    { value: 'isNot', label: 'Is not' },
  ],
  multiSelect: [
    { value: 'in', label: 'Is any of' },
    { value: 'notIn', label: 'Is not any of' },
  ],
  currency: [
    { value: 'equals', label: 'Equals' },
    { value: 'greaterThan', label: 'Greater than' },
    { value: 'lessThan', label: 'Less than' },
    { value: 'greaterThanOrEqual', label: 'Greater than or equal' },
    { value: 'lessThanOrEqual', label: 'Less than or equal' },
    { value: 'between', label: 'Between' },
  ],
  array: [
    { value: 'contains', label: 'Contains' },
    { value: 'notContains', label: 'Does not contain' },
    { value: 'hasAny', label: 'Has any of' },
    { value: 'hasAll', label: 'Has all of' },
  ],
};

export function getDefaultOperator(fieldType: FieldType): OperatorConfig {
  return operatorsByFieldType[fieldType][0];
}
