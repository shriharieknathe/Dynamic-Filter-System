import { useState, useEffect, useMemo } from 'react';
import {
  Box, Container, Typography, ThemeProvider, createTheme,
  CssBaseline, CircularProgress, IconButton, Tooltip,
} from '@mui/material';
import { Sun, Moon } from 'lucide-react';
import { FilterBuilder } from './components/filters/FilterBuilder';
import { DataTable } from './components/table/DataTable';
import { useFilters } from './hooks/useFilters';
import { useDebounce } from './hooks/useDebounce';
import { useThemeMode } from './hooks/useThemeMode';
import { applyFilters } from './utils/filterEngine';
import { fetchEmployees } from './services/employeeApi';
import type { Employee } from './types/employee';

const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: { main: '#7c3aed', light: '#a78bfa', dark: '#5b21b6' },
    secondary: { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
    background: mode === 'dark'
      ? { default: '#0f172a', paper: '#1e293b' }
      : { default: '#f8fafc', paper: '#ffffff' },
    divider: mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(100, 116, 139, 0.12)',
    text: mode === 'dark'
      ? { primary: '#f1f5f9', secondary: '#94a3b8' }
      : { primary: '#1e293b', secondary: '#64748b' },
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
    info: { main: '#3b82f6' },
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", monospace',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 500 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(100, 116, 139, 0.12)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(100, 116, 139, 0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: mode === 'dark' ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.4)',
          },
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { mode, toggleMode } = useThemeMode();
  const theme = useMemo(() => getTheme(mode), [mode]);

  const filterState = useFilters();
  const { filters } = filterState;
  const debouncedFilters = useDebounce(filters, 150);

  useEffect(() => {
    let mounted = true;

    fetchEmployees()
      .then((data) => {
        if (mounted) {
          setEmployees(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError('Failed to load employee data');
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, []);

  const filteredEmployees = useMemo(() => {
    return applyFilters(employees, debouncedFilters);
  }, [employees, debouncedFilters]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.default' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={48} />
            <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>Loading...</Typography>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.default' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  const bgGradient = mode === 'dark'
    ? `linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
       linear-gradient(225deg, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
       #0f172a`
    : `linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, transparent 50%),
       linear-gradient(225deg, rgba(6, 182, 212, 0.04) 0%, transparent 50%),
       #f8fafc`;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: bgGradient, py: 4 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  background: mode === 'dark'
                    ? 'linear-gradient(135deg, #a78bfa 0%, #22d3ee 100%)'
                    : 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Dynamic Filter System
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Build complex queries with type-safe, real-time filtering
              </Typography>
            </Box>

            <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton
                onClick={toggleMode}
                sx={{
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FilterBuilder filterState={filterState} />
          </Box>

          <DataTable data={filteredEmployees} totalCount={employees.length} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
