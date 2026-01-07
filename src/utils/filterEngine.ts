import type { FilterCondition, FilterOperator, FilterValue, FieldType } from '../types/filters';
import { fieldConfigMap } from '../config/fieldConfig';
import { getNestedValue } from './getNestedValue';

// --- Text ---

function matchText(fieldValue: unknown, operator: FilterOperator, filterValue: FilterValue): boolean {
  if (fieldValue === null || fieldValue === undefined) {
    return false;
  }

  const textValue = String(fieldValue).toLowerCase();
  const searchValue = String(filterValue ?? '').toLowerCase();

  switch (operator) {
    case 'equals':
      return textValue === searchValue;
    case 'contains':
      return textValue.includes(searchValue);
    case 'startsWith':
      return textValue.startsWith(searchValue);
    case 'endsWith':
      return textValue.endsWith(searchValue);
    case 'notContains':
      return !textValue.includes(searchValue);
    default:
      return false;
  }
}

// --- Number ---

function matchNumber(fieldValue: unknown, operator: FilterOperator, filterValue: FilterValue): boolean {
  if (fieldValue === null || fieldValue === undefined) {
    return false;
  }

  const numValue = Number(fieldValue);
  if (isNaN(numValue)) return false;

  if (operator === 'between' && Array.isArray(filterValue)) {
    const [min, max] = filterValue.map(Number);
    if (isNaN(min) || isNaN(max)) return false;
    return numValue >= min && numValue <= max;
  }

  const compareValue = Number(filterValue);
  if (isNaN(compareValue)) return false;

  switch (operator) {
    case 'equals':
      return numValue === compareValue;
    case 'greaterThan':
      return numValue > compareValue;
    case 'lessThan':
      return numValue < compareValue;
    case 'greaterThanOrEqual':
      return numValue >= compareValue;
    case 'lessThanOrEqual':
      return numValue <= compareValue;
    default:
      return false;
  }
}

// --- Date ---

function matchDate(fieldValue: unknown, operator: FilterOperator, filterValue: FilterValue): boolean {
  if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
    return false;
  }

  const dateValue = new Date(fieldValue as string).getTime();
  if (isNaN(dateValue)) return false;

  if (operator === 'between' && Array.isArray(filterValue)) {
    const [start, end] = filterValue.map((v) => new Date(v as string).getTime());
    if (isNaN(start) || isNaN(end)) return false;
    return dateValue >= start && dateValue <= end;
  }

  const compareDate = new Date(filterValue as string).getTime();
  if (isNaN(compareDate)) return false;

  switch (operator) {
    case 'before':
      return dateValue < compareDate;
    case 'after':
      return dateValue > compareDate;
    default:
      return false;
  }
}

// --- Boolean ---

function matchBoolean(fieldValue: unknown, operator: FilterOperator, filterValue: FilterValue): boolean {
  if (fieldValue === null || fieldValue === undefined) return false;

  const boolValue = Boolean(fieldValue);
  const filterBool = filterValue === 'true' || filterValue === true;

  return operator === 'is' ? boolValue === filterBool : false;
}

// --- Select ---

function matchSingleSelect(fieldValue: unknown, operator: FilterOperator, filterValue: FilterValue): boolean {
  if (fieldValue === null || fieldValue === undefined) return false;

  const strValue = String(fieldValue).toLowerCase();
  const compareValue = String(filterValue ?? '').toLowerCase();

  switch (operator) {
    case 'is':
      return strValue === compareValue;
    case 'isNot':
      return strValue !== compareValue;
    default:
      return false;
  }
}

function matchMultiSelect(fieldValue: unknown, operator: FilterOperator, filterValue: FilterValue): boolean {
  if (fieldValue === null || fieldValue === undefined) return false;

  const strValue = String(fieldValue).toLowerCase();

  if (!Array.isArray(filterValue) || filterValue.length === 0) {
    return true;
  }

  const compareValues = filterValue.map((v) => String(v).toLowerCase());

  switch (operator) {
    case 'in':
      return compareValues.includes(strValue);
    case 'notIn':
      return !compareValues.includes(strValue);
    default:
      return false;
  }
}

// --- Array (skills) ---

function matchArray(fieldValue: unknown, operator: FilterOperator, filterValue: FilterValue): boolean {
  if (!Array.isArray(fieldValue)) return false;

  const arrayValue = fieldValue.map((v) => String(v).toLowerCase());

  if (typeof filterValue === 'string') {
    const searchValue = filterValue.toLowerCase();
    switch (operator) {
      case 'contains':
        return arrayValue.includes(searchValue);
      case 'notContains':
        return !arrayValue.includes(searchValue);
      default:
        return false;
    }
  }

  if (Array.isArray(filterValue)) {
    if (filterValue.length === 0) return true;
    const searchValues = filterValue.map((v) => String(v).toLowerCase());

    switch (operator) {
      case 'hasAny':
        return searchValues.some((v) => arrayValue.includes(v));
      case 'hasAll':
        return searchValues.every((v) => arrayValue.includes(v));
      default:
        return false;
    }
  }

  return false;
}

// --- Router ---

function matchValue(
  fieldValue: unknown,
  operator: FilterOperator,
  filterValue: FilterValue,
  fieldType: FieldType
): boolean {
  switch (fieldType) {
    case 'text':
      return matchText(fieldValue, operator, filterValue);
    case 'number':
    case 'currency':
      return matchNumber(fieldValue, operator, filterValue);
    case 'date':
      return matchDate(fieldValue, operator, filterValue);
    case 'boolean':
      return matchBoolean(fieldValue, operator, filterValue);
    case 'singleSelect':
      return matchSingleSelect(fieldValue, operator, filterValue);
    case 'multiSelect':
      return matchMultiSelect(fieldValue, operator, filterValue);
    case 'array':
      return matchArray(fieldValue, operator, filterValue);
    default:
      return false;
  }
}

// --- Filter Engine ---

function hasValidValue(condition: FilterCondition): boolean {
  const { value } = condition;
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (Array.isArray(value) && value.every((v) => v === '' || v === null)) return false;
  return true;
}

function groupFiltersByField(filters: FilterCondition[]): Map<string, FilterCondition[]> {
  const groups = new Map<string, FilterCondition[]>();

  for (const filter of filters) {
    if (!hasValidValue(filter)) continue;
    const existing = groups.get(filter.field) || [];
    existing.push(filter);
    groups.set(filter.field, existing);
  }

  return groups;
}

// AND between different fields, OR within same field
function matchesAllFilters<T>(record: T, filterGroups: Map<string, FilterCondition[]>): boolean {
  for (const [field, conditions] of filterGroups) {
    const fieldConfig = fieldConfigMap[field];
    if (!fieldConfig) continue;

    const fieldValue = getNestedValue(record, field);
    const anyMatch = conditions.some((c) =>
      matchValue(fieldValue, c.operator, c.value, fieldConfig.type)
    );

    if (!anyMatch) return false;
  }
  return true;
}

export function applyFilters<T>(data: T[], filters: FilterCondition[]): T[] {
  if (!filters || filters.length === 0) return data;

  const filterGroups = groupFiltersByField(filters);
  if (filterGroups.size === 0) return data;

  return data.filter((record) => matchesAllFilters(record, filterGroups));
}
