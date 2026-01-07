import { Box, Button, Typography, Paper, Chip } from '@mui/material';
import { Plus, Trash2, Filter } from 'lucide-react';
import type { UseFiltersReturn } from '../../hooks/useFilters';
import { FilterRow } from './FilterRow';

interface FilterBuilderProps {
  filterState: UseFiltersReturn;
}

export function FilterBuilder({ filterState }: FilterBuilderProps) {
  const {
    filters,
    addFilter,
    removeFilter,
    updateFilterField,
    updateFilterOperator,
    updateFilterValue,
    clearAllFilters,
  } = filterState;

  const hasFilters = filters.length > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Filter size={20} />
          <Typography variant="h6" component="h2">
            Filters
          </Typography>
          {hasFilters && (
            <Chip label={filters.length} size="small" color="primary" sx={{ ml: 1 }} />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={() => addFilter()}
          >
            Add Filter
          </Button>
          {hasFilters && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<Trash2 size={16} />}
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {filters.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', py: 3 }}
          >
            No filters applied. Click "Add Filter" to start filtering data.
          </Typography>
        ) : (
          filters.map((filter) => (
            <FilterRow
              key={filter.id}
              filter={filter}
              onFieldChange={(field) => updateFilterField(filter.id, field)}
              onOperatorChange={(operator) => updateFilterOperator(filter.id, operator)}
              onValueChange={(value) => updateFilterValue(filter.id, value)}
              onRemove={() => removeFilter(filter.id)}
            />
          ))
        )}
      </Box>

      {filters.length > 1 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 2 }}
        >
          Different fields = AND logic. Same field = OR logic.
        </Typography>
      )}
    </Paper>
  );
}
