# Dynamic Filter Component System

A reusable, type-safe dynamic filter component system built with React 18 and TypeScript. 
This project demonstrates a modular architecture for building complex filtering UIs that 
can be integrated with any data table.

## Features

- **Multi-type filter support** - Text, Number, Date, Boolean, Single/Multi Select, Currency, Arrays
- **Dynamic operators** - Operators change based on selected field type
- **Real-time filtering** - Table updates as you type (with debouncing)
- **Filter persistence** - Filters are saved to localStorage
- **Nested object filtering** - Support for dot notation (e.g., `address.city`)
- **Sortable columns** - Click column headers to sort
- **AND/OR logic** - AND between fields, OR within same field

## Tech Stack

- React 18 + TypeScript
- Vite
- Material UI
- Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

## Setup

```bash
npm install
npm run dev
```

## Features

- Multi-type filters (text, number, date, boolean, select, array)
- Dynamic operators based on field type
- Real-time filtering with debounce
- Filter persistence (localStorage)
- Nested object filtering (dot notation)
- Sortable columns
- Light/dark theme

## Structure

```
src/
├── components/filters/   - Filter UI
├── components/table/     - Data table
├── config/               - Field & operator configs
├── data/                 - Sample data
├── hooks/                - useFilters, useDebounce, useThemeMode
├── services/             - Mock API
├── types/                - TypeScript types
└── utils/                - Filter engine
```

## Filter Logic

- Different fields = AND
- Same field = OR
