import { Head } from '@inertiajs/react';
import CommercialSidebar from '@/Components/CommercialSidebar';

export default function DevisPage() {
  return (
    <>
      <Head title="Commercial - Devis" />
      <div className="flex min-h-screen bg-slate-100">
        <CommercialSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Devis</h1>
          <p className="text-gray-600">Cette section sera completee prochainement.</p>
        </main>
      </div>
    </>
  );
}
