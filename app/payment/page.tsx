import { Metadata } from 'next';
import { PaymentView } from '@/features/payment/view/PaymentView';

export const metadata: Metadata = {
  title: 'Payment - BuildCore Construction',
  description: 'Manage construction payment methods via REST API',
};

export default function PaymentPage() {
  return <PaymentView />;
}
