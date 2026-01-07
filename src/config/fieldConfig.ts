import type { FieldConfig } from '../types/filters';

export const employeeFieldConfigs: FieldConfig[] = [
  { field: 'name', label: 'Name', type: 'text' },
  { field: 'email', label: 'Email', type: 'text' },
  {
    field: 'department',
    label: 'Department',
    type: 'singleSelect',
    options: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'Product'],
  },
  {
    field: 'role',
    label: 'Role',
    type: 'singleSelect',
    options: [
      'Software Engineer',
      'Senior Software Engineer',
      'Tech Lead',
      'Engineering Manager',
      'Product Manager',
      'Designer',
      'Data Analyst',
      'Marketing Manager',
      'Sales Representative',
      'HR Specialist',
      'Financial Analyst',
      'Operations Manager',
      'Legal Counsel',
    ],
  },
  { field: 'salary', label: 'Salary', type: 'currency' },
  { field: 'joinDate', label: 'Join Date', type: 'date' },
  { field: 'isActive', label: 'Is Active', type: 'boolean' },
  {
    field: 'skills',
    label: 'Skills',
    type: 'array',
    options: [
      'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js',
      'Python', 'Java', 'Go', 'Rust', 'SQL', 'MongoDB', 'AWS', 'Docker',
      'Kubernetes', 'GraphQL', 'REST API', 'Agile', 'Scrum', 'Leadership',
    ],
  },
  { field: 'address.city', label: 'City', type: 'text' },
  { field: 'address.state', label: 'State', type: 'text' },
  {
    field: 'address.country',
    label: 'Country',
    type: 'singleSelect',
    options: ['USA', 'UK', 'Canada', 'Germany', 'Australia', 'India', 'Japan', 'France'],
  },
  { field: 'projects', label: 'Projects', type: 'number' },
  { field: 'lastReview', label: 'Last Review', type: 'date' },
  { field: 'performanceRating', label: 'Performance Rating', type: 'number' },
];

export const fieldConfigMap: Record<string, FieldConfig> = employeeFieldConfigs.reduce(
  (acc, config) => {
    acc[config.field] = config;
    return acc;
  },
  {} as Record<string, FieldConfig>
);
