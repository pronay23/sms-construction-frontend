import { Metadata } from 'next';
import { InventoryView } from '@/features/inventory/view/InventoryView';

export const metadata: Metadata = {
  title: 'Inventory - BuildCore Construction',
  description: 'Manage construction inventory items via REST API',
};

export default function InventoryPage() {
  return <InventoryView />;
}
