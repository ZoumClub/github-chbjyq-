import { Eye, Check, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { ListingStatus } from '../private-listings/ListingStatus';
import { ListingModal } from '../private-listings/ListingModal';
import type { PrivateListing } from '@/lib/supabase';

interface PrivateListingsTableProps {
  listings: PrivateListing[];
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  isUpdating: boolean;
}

export function PrivateListingsTable({ 
  listings,
  onStatusUpdate,
  isUpdating
}: PrivateListingsTableProps) {
  const [selectedListing, setSelectedListing] = useState<PrivateListing | null>(null);

  if (!listings.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center text-gray-500">
        No private listings found
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car Details
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
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{listing.client_name}</div>
                    <div className="text-sm text-gray-500">{listing.client_phone}</div>
                    <div className="text-sm text-gray-500">{listing.client_city}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {listing.year} {listing.make} {listing.model}
                    </div>
                    <div className="text-sm text-gray-500">
                      {listing.mileage} • {listing.fuel_type} • {listing.transmission}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      £{listing.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ListingStatus status={listing.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedListing(listing)}
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                        title="View details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {listing.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onStatusUpdate(listing.id!, 'approved')}
                            disabled={isUpdating}
                            className="text-green-600 hover:text-green-900 transition-colors p-1 rounded hover:bg-green-50 disabled:opacity-50"
                            title="Approve and publish listing"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => onStatusUpdate(listing.id!, 'rejected')}
                            disabled={isUpdating}
                            className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50 disabled:opacity-50"
                            title="Reject listing"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedListing && (
        <ListingModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onApprove={
            selectedListing.status === 'pending'
              ? () => onStatusUpdate(selectedListing.id!, 'approved')
              : undefined
          }
          onReject={
            selectedListing.status === 'pending'
              ? () => onStatusUpdate(selectedListing.id!, 'rejected')
              : undefined
          }
          isUpdating={isUpdating}
        />
      )}
    </>
  );
}