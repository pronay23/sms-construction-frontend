import { Metadata } from 'next';
import { EmployeeView } from '@/features/employee/view/EmployeeView';

export const metadata: Metadata = {
  title: 'Employee - BuildCore Construction',
  description: 'Manage construction employees via REST API',
};

export default function EmployeePage() {
  return <EmployeeView />;
}
