import { Metadata } from 'next';
import { VendorView } from '@/features/vendor/view/VendorView';

export const metadata: Metadata = {
  title: 'Vendor - BuildCore Construction',
  description: 'Manage construction vendors via REST API',
};

export default function VendorPage() {
  return <VendorView />;
}
