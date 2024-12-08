import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, Trash2, Plus, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Car } from '@/lib/supabase';

interface CarListProps {
  onDelete: (id: string) => void;
  onToggleSold: (car: Car) => void;
}

export function CarList({ onDelete, onToggleSold }: CarListProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          brand:brands (
            id,
            name,
            logo_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Car Listings</h1>
        <Link
          href="/admin/dashboard/cars/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add New Car
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Make
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cars.map((car) => (
                <tr key={car.id} className={`hover:bg-gray-50 relative ${car.is_sold ? 'opacity-75' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative">
                      <Image
                        src={car.image}
                        alt={`${car.make} ${car.model}`}
                        width={64}
                        height={48}
                        className="object-cover rounded"
                      />
                      {car.is_sold && (
                        <div className="absolute inset-0 bg-red-600 bg-opacity-50 flex items-center justify-center rounded">
                          <span className="text-white font-bold transform -rotate-45">SOLD</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.make}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{car.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    £{car.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      car.condition === 'new' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {car.condition.charAt(0).toUpperCase() + car.condition.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <Link
                        href={`/admin/dashboard/cars/${car.id}`}
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                        title="Edit car"
                      >
                        <Pencil className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => onToggleSold(car)}
                        className={`${
                          car.is_sold ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'
                        } transition-colors p-1 rounded hover:bg-orange-50`}
                        title={car.is_sold ? 'Mark as available' : 'Mark as sold'}
                      >
                        <Tag className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(car.id)}
                        className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                        title="Delete car"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cars.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No cars found. Add your first car listing!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}