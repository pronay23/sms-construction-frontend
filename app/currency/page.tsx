import { Metadata } from 'next';
import { CurrencyView } from '@/features/currency/view/CurrencyView';

export const metadata: Metadata = {
  title: 'Currency - BuildCore Construction',
  description: 'Manage construction currencies via REST API',
};

export default function CurrencyPage() {
  return <CurrencyView />;
}
