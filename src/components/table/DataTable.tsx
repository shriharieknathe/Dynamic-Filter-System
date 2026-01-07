import { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TableSortLabel, Paper, Typography, Box, Chip, Tooltip,
} from '@mui/material';
import { AlertCircle, Users } from 'lucide-react';
import type { Employee } from '../../types/employee';
import { getNestedValue } from '../../utils/getNestedValue';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: unknown, row: Employee) => React.ReactNode;
  sortable?: boolean;
}

const columns: Column[] = [
  { id: 'id', label: 'ID', minWidth: 60, align: 'center', sortable: true },
  { id: 'name', label: 'Name', minWidth: 150, sortable: true },
  { id: 'email', label: 'Email', minWidth: 200, sortable: true },
  { id: 'department', label: 'Department', minWidth: 120, sortable: true },
  { id: 'role', label: 'Role', minWidth: 160, sortable: true },
  {
    id: 'salary',
    label: 'Salary',
    minWidth: 100,
    align: 'right',
    sortable: true,
    format: (value) => `$${Number(value).toLocaleString()}`,
  },
  { id: 'joinDate', label: 'Join Date', minWidth: 110, sortable: true },
  {
    id: 'isActive',
    label: 'Status',
    minWidth: 90,
    align: 'center',
    sortable: true,
    format: (value) => (
      <Chip
        label={value ? 'Active' : 'Inactive'}
        size="small"
        color={value ? 'success' : 'default'}
        variant="outlined"
      />
    ),
  },
  {
    id: 'skills',
    label: 'Skills',
    minWidth: 200,
    format: (value) => {
      const skills = value as string[];
      if (!skills || skills.length === 0) return '—';
      const displaySkills = skills.slice(0, 3);
      const remaining = skills.length - 3;
      return (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {displaySkills.map((skill) => (
            <Chip key={skill} label={skill} size="small" variant="outlined" />
          ))}
          {remaining > 0 && (
            <Tooltip title={skills.slice(3).join(', ')}>
              <Chip label={`+${remaining}`} size="small" color="primary" variant="filled" />
            </Tooltip>
          )}
        </Box>
      );
    },
  },
  { id: 'address.city', label: 'City', minWidth: 120, sortable: true },
  { id: 'address.country', label: 'Country', minWidth: 100, sortable: true },
  { id: 'projects', label: 'Projects', minWidth: 80, align: 'center', sortable: true },
  {
    id: 'performanceRating',
    label: 'Rating',
    minWidth: 80,
    align: 'center',
    sortable: true,
    format: (value) => {
      const rating = Number(value);
      const color = rating >= 4.5 ? 'success' : rating >= 4 ? 'primary' : rating >= 3.5 ? 'warning' : 'error';
      return <Chip label={rating.toFixed(1)} size="small" color={color} />;
    },
  },
];

type SortDirection = 'asc' | 'desc';

interface DataTableProps {
  data: Employee[];
  totalCount: number;
}

export function DataTable({ data, totalCount }: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortColumn);
      const bValue = getNestedValue(b, sortColumn);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        comparison = aValue === bValue ? 0 : aValue ? -1 : 1;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const filteredCount = data.length;
  const isFiltered = filteredCount !== totalCount;

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Users size={20} />
          <Typography variant="h6" component="h2">Employees</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isFiltered ? (
            <Chip label={`${filteredCount} of ${totalCount} records`} size="small" color="info" variant="outlined" />
          ) : (
            <Chip label={`${totalCount} records`} size="small" variant="outlined" />
          )}
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{ fontWeight: 600, backgroundColor: 'background.paper' }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortColumn === column.id}
                      direction={sortColumn === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                    <AlertCircle size={48} strokeWidth={1.5} />
                    <Typography variant="h6">No results found</Typography>
                    <Typography variant="body2">Try adjusting your filters.</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row) => (
                <TableRow hover key={row.id}>
                  {columns.map((column) => {
                    const value = getNestedValue(row, column.id);
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format(value, row) : String(value ?? '—')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
