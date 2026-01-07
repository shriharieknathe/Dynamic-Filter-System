export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'boolean'
  | 'singleSelect'
  | 'multiSelect'
  | 'currency'
  | 'array';

export type TextOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'notContains';
export type NumberOperator = 'equals' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 'between';
export type DateOperator = 'before' | 'after' | 'between';
export type BooleanOperator = 'is';
export type SingleSelectOperator = 'is' | 'isNot';
export type MultiSelectOperator = 'in' | 'notIn';
export type CurrencyOperator = 'between' | 'equals' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual';
export type ArrayOperator = 'contains' | 'notContains' | 'hasAny' | 'hasAll';

export type FilterOperator =
  | TextOperator
  | NumberOperator
  | DateOperator
  | BooleanOperator
  | SingleSelectOperator
  | MultiSelectOperator
  | CurrencyOperator
  | ArrayOperator;

export type FilterValue = string | number | boolean | string[] | [string | number, string | number] | null;

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: FilterValue;
}

export interface FieldConfig {
  field: string;
  label: string;
  type: FieldType;
  options?: string[];
}

export interface OperatorConfig {
  value: FilterOperator;
  label: string;
}
