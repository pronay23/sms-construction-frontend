import { Metadata } from 'next';
import { ExpenseView } from '@/features/expense/view/ExpenseView';

export const metadata: Metadata = {
  title: 'Expense - BuildCore Construction',
  description: 'Manage construction expenses via REST API',
};

export default function ExpensePage() {
  return <ExpenseView />;
}
