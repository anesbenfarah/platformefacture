import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import CommercialSidebar from '@/Components/CommercialSidebar';
import { Package, Wrench, Users } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">{value ?? 0}</p>
    </div>
  </div>
);

export default function CommercialDashboard() {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/auth/user', { headers: { Accept: 'application/json' } }),
      axios.get('/api/commercial/dashboard/stats', { headers: { Accept: 'application/json' } }),
    ])
      .then(([userRes, statsRes]) => {
        setUser(userRes.data?.user ?? null);
        setStats(statsRes.data?.data ?? null);
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          router.visit('/');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head title="Commercial - Dashboard" />
      <div className="flex min-h-screen bg-slate-100">
        <CommercialSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Bonjour{user?.name ? `, ${user.name}` : ''} !
            </h1>
            <p className="text-gray-500 mt-1">Apercu de votre espace commercial.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
              <StatCard icon={Package} label="Produits" value={stats?.total_produits} color="bg-emerald-500" />
              <StatCard icon={Wrench} label="Services" value={stats?.total_services} color="bg-blue-500" />
              <StatCard icon={Users} label="Clients" value={stats?.clients} color="bg-purple-500" />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
