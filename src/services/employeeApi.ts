import { employees as employeeData } from '../data/employees';
import type { Employee } from '../types/employee';

function delay(ms: number = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchEmployees(): Promise<Employee[]> {
  await delay(400);
  return employeeData;
}

export async function fetchEmployeeById(id: number): Promise<Employee | null> {
  await delay(200);
  return employeeData.find((emp) => emp.id === id) || null;
}

export async function getEmployeeCount(): Promise<number> {
  await delay(100);
  return employeeData.length;
}
