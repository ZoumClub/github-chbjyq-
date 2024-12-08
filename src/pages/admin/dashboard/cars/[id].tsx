import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { CarForm } from '@/components/admin/CarForm';
import { supabase } from '@/lib/supabase';
import type { Car } from '@/lib/supabase';

export default function EditCarPage() {
  const router = useRouter();
  const { id } = router.query;
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadCar(id as string);
    }
  }, [id]);

  const loadCar = async (carId: string) => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          brand:brands (
            id,
            name,
            logo_url
          ),
          features:car_features (
            id,
            name,
            available
          )
        `)
        .eq('id', carId)
        .single();

      if (error) throw error;
      setCar(data);
    } catch (error) {
      console.error('Error loading car:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!car) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Car not found</h2>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Return to dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Car</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>
        <CarForm 
          initialData={car}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          onSuccess={() => router.push('/admin/dashboard')}
        />
      </div>
    </Layout>
  );
}