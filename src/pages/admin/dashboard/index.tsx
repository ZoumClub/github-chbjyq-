import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { CarList } from '@/components/admin/CarList';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Car, Plus, ClipboardList, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace('/admin/login');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-64 bg-white shadow-md">
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-4">
            <Link
              href="/admin/dashboard/cars"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Car className="h-5 w-5 mr-2" />
              Car Listings
            </Link>
            <Link
              href="/admin/dashboard/cars/new"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Car
            </Link>
            <Link
              href="/admin/dashboard/private-listings"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <ClipboardList className="h-5 w-5 mr-2" />
              Private Listings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </nav>
        </div>

        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
          <CarList
            onDelete={async (id) => {
              try {
                const { error } = await supabase
                  .from('cars')
                  .delete()
                  .eq('id', id);

                if (error) throw error;
                toast.success('Car deleted successfully');
                router.reload();
              } catch (error) {
                console.error('Error deleting car:', error);
                toast.error('Failed to delete car');
              }
            }}
            onToggleSold={async (car) => {
              try {
                const { error } = await supabase
                  .from('cars')
                  .update({ is_sold: !car.is_sold })
                  .eq('id', car.id);

                if (error) throw error;
                toast.success(`Car marked as ${!car.is_sold ? 'sold' : 'available'}`);
                router.reload();
              } catch (error) {
                console.error('Error updating car:', error);
                toast.error('Failed to update car status');
              }
            }}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </Layout>
  );
}