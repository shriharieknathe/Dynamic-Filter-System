import { useState, useCallback, useEffect } from 'react';
import type { FilterCondition, FilterOperator, FilterValue } from '../types/filters';
import { fieldConfigMap } from '../config/fieldConfig';
import { getDefaultOperator } from '../config/operators';

const STORAGE_KEY = 'employee_filters';

function generateFilterId(): string {
  return `filter-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function loadFiltersFromStorage(): FilterCondition[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveFiltersToStorage(filters: FilterCondition[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // storage might be full
  }
}

export function useFilters(initialFilters: FilterCondition[] = []) {
  const [filters, setFilters] = useState<FilterCondition[]>(() => {
    const stored = loadFiltersFromStorage();
    return stored.length > 0 ? stored : initialFilters;
  });

  useEffect(() => {
    saveFiltersToStorage(filters);
  }, [filters]);

  const addFilter = useCallback((defaultField?: string) => {
    const field = defaultField || 'name';
    const fieldConfig = fieldConfigMap[field];
    const defaultOp = fieldConfig ? getDefaultOperator(fieldConfig.type) : { value: 'contains' as FilterOperator };

    const newFilter: FilterCondition = {
      id: generateFilterId(),
      field,
      operator: defaultOp.value,
      value: null,
    };

    setFilters((prev) => [...prev, newFilter]);
  }, []);

  const removeFilter = useCallback((filterId: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== filterId));
  }, []);

  const updateFilterField = useCallback((filterId: string, newField: string) => {
    setFilters((prev) =>
      prev.map((filter) => {
        if (filter.id !== filterId) return filter;

        const fieldConfig = fieldConfigMap[newField];
        const defaultOp = fieldConfig
          ? getDefaultOperator(fieldConfig.type)
          : { value: 'contains' as FilterOperator };

        return {
          ...filter,
          field: newField,
          operator: defaultOp.value,
          value: null,
        };
      })
    );
  }, []);

  const updateFilterOperator = useCallback((filterId: string, newOperator: FilterOperator) => {
    setFilters((prev) =>
      prev.map((filter) => {
        if (filter.id !== filterId) return filter;

        const wasBetween = filter.operator === 'between';
        const isBetween = newOperator === 'between';
        const shouldResetValue = wasBetween !== isBetween;

        return {
          ...filter,
          operator: newOperator,
          value: shouldResetValue ? null : filter.value,
        };
      })
    );
  }, []);

  const updateFilterValue = useCallback((filterId: string, newValue: FilterValue) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId ? { ...filter, value: newValue } : filter
      )
    );
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const setAllFilters = useCallback((newFilters: FilterCondition[]) => {
    setFilters(newFilters);
  }, []);

  return {
    filters,
    addFilter,
    removeFilter,
    updateFilterField,
    updateFilterOperator,
    updateFilterValue,
    clearAllFilters,
    setAllFilters,
  };
}

export type UseFiltersReturn = ReturnType<typeof useFilters>;
