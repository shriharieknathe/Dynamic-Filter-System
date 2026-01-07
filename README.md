# Dynamic Filter Component System

A reusable filter builder for React data tables with TypeScript support.

## Tech Stack

- React 18 + TypeScript
- Vite
- Material UI
- Lucide React icons

## Setup

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## What I Built

### Filter Builder
- Add/remove multiple filter conditions
- Field dropdown shows all filterable columns
- Operators change automatically based on field type (text gets "contains", numbers get "greater than", etc.)
- Value input adapts to field type (text field, number input, date picker, dropdown, multi-select)

### Supported Filter Types

| Type | Operators | Input |
|------|-----------|-------|
| Text | equals, contains, starts with, ends with | Text field |
| Number | =, >, <, >=, <=, between | Number input |
| Date | before, after, between | Date picker |
| Boolean | is | Yes/No dropdown |
| Select | is, is not | Dropdown |
| Multi-select | in, not in | Multi-select with chips |
| Array (skills) | contains, has any, has all | Text or multi-select |

### Filter Logic
- Multiple filters on **different fields** → AND (all must match)
- Multiple filters on **same field** → OR (any can match)
- Example: Department = "Engineering" AND (Role = "Developer" OR Role = "Tech Lead")

### Data Table
- Sortable columns (click header to sort)
- Shows filtered count vs total count
- Handles nested data display (address.city, address.country)
- Empty state when no results match

### Extra Features
- **Debounced text input** - waits 300ms before filtering to avoid lag while typing
- **Filter persistence** - filters saved to localStorage, restored on page reload
- **Light/dark theme** - toggle in top right, respects system preference
- **Mock API** - simulates network delay for realistic loading state

## Project Structure

```
src/
├── components/
│   ├── filters/          - FilterBuilder, FilterRow, OperatorSelect, ValueInputs
│   └── table/            - DataTable with sorting
├── config/
│   ├── fieldConfig.ts    - defines which fields are filterable
│   └── operators.ts      - maps field types to available operators
├── hooks/
│   ├── useFilters.ts     - filter state management + localStorage
│   ├── useDebounce.ts    - debounce hook
│   └── useThemeMode.ts   - light/dark theme
├── utils/
│   ├── filterEngine.ts   - core filtering logic
│   └── getNestedValue.ts - access nested props with dot notation
├── services/
│   └── employeeApi.ts    - mock API with delay
├── data/
│   └── employees.ts      - 60 sample records
└── types/
    ├── employee.ts
    └── filters.ts
```

## How to Add a New Filter Field

1. Add field config in `src/config/fieldConfig.ts`:
```typescript
{ field: 'newField', label: 'New Field', type: 'text' }
```

2. For nested fields, use dot notation:
```typescript
{ field: 'address.zipCode', label: 'Zip Code', type: 'text' }
```

3. For dropdowns, add options:
```typescript
{ field: 'status', label: 'Status', type: 'singleSelect', options: ['Active', 'Pending', 'Closed'] }
```

The filter engine and UI components will handle the rest automatically.
