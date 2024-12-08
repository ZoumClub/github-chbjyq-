import type { Brand, Car, Dealer } from '@/lib/supabase';

interface BasicInfoProps {
  formData: Partial<Car>;
  setFormData: (data: Partial<Car>) => void;
  brands: Brand[];
  dealers: Dealer[];
}

export function BasicInfo({ formData, setFormData, brands, dealers }: BasicInfoProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value
    });

    if (name === 'brand_id') {
      const selectedBrand = brands.find(b => b.id === value);
      if (selectedBrand) {
        setFormData({
          ...formData,
          brand_id: value,
          make: selectedBrand.name
        });
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <select
            name="brand_id"
            value={formData.brand_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dealer
          </label>
          <select
            name="dealer_id"
            value={formData.dealer_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a dealer</option>
            {dealers.map((dealer) => (
              <option key={dealer.id} value={dealer.id}>
                {dealer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear() + 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (£)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Enter price"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Condition
          </label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="is_sold"
            value={formData.is_sold ? 'true' : 'false'}
            onChange={(e) => setFormData({ ...formData, is_sold: e.target.value === 'true' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="false">Available</option>
            <option value="true">Sold</option>
          </select>
        </div>
      </div>
    </div>
  );
}