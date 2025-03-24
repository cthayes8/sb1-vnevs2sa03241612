import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Smartphone, 
  Tablet, 
  Wifi, 
  Signal, 
  Laptop,
  Tag,
  Calendar,
  DollarSign,
  Clock,
  Filter,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Types
type DeviceType = 'phones' | 'tablets' | 'hotspots' | 'fixed_wireless' | 'laptops';
type CarrierId = 'att' | 'verizon' | 'tmobile';

interface Promotion {
  id: string;
  carrierId: CarrierId;
  deviceType: DeviceType;
  title: string;
  description: string;
  value: string;
  endDate: string;
  requirements: string[];
}

// Device type configuration
const deviceTypes: Record<DeviceType, { label: string; Icon: React.ComponentType<any> }> = {
  phones: { label: 'Phones', Icon: Smartphone },
  tablets: { label: 'Tablets', Icon: Tablet },
  hotspots: { label: 'Hotspots', Icon: Wifi },
  fixed_wireless: { label: 'Fixed Wireless', Icon: Signal },
  laptops: { label: 'Laptops', Icon: Laptop }
};

// Carrier configuration
const carriers = [
  { id: 'att' as CarrierId, name: 'AT&T' },
  { id: 'verizon' as CarrierId, name: 'Verizon' },
  { id: 'tmobile' as CarrierId, name: 'T-Mobile' }
];

// Sample promotions data
const promotions: Promotion[] = [
  {
    id: '1',
    carrierId: 'att',
    deviceType: 'phones',
    title: 'Business Elite BOGO',
    description: 'Buy one iPhone 15 Pro, get one free when adding a new line on Business Elite plans',
    value: 'Up to $1000 off',
    endDate: '2025-06-30',
    requirements: [
      'New line required',
      'Business Elite plan',
      '36-month installment plan',
      'Minimum 5 lines'
    ]
  },
  {
    id: '2',
    carrierId: 'verizon',
    deviceType: 'tablets',
    title: 'iPad Pro Offer',
    description: 'Get an iPad Pro for $200 when adding a new tablet line',
    value: '$730 off',
    endDate: '2025-05-15',
    requirements: [
      'New tablet line required',
      '24-month installment plan',
      'Unlimited tablet plan'
    ]
  },
  {
    id: '3',
    carrierId: 'tmobile',
    deviceType: 'fixed_wireless',
    title: 'Business Internet Deal',
    description: 'Get T-Mobile Business Internet with no setup fees and first 3 months free',
    value: '$360 savings',
    endDate: '2025-07-01',
    requirements: [
      '24-month agreement',
      'AutoPay required',
      'Available in 5G areas'
    ]
  },
  // Add more sample promotions for each carrier and device type
];

const CarrierPromos = () => {
  const navigate = useNavigate();
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierId | null>(null);
  const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceType | null>(null);

  // Filter promotions based on selections
  const filteredPromotions = promotions.filter(promo => {
    if (selectedCarrier && promo.carrierId !== selectedCarrier) return false;
    if (selectedDeviceType && promo.deviceType !== selectedDeviceType) return false;
    return true;
  });

  const renderDeviceIcon = (type: DeviceType) => {
    const IconComponent = deviceTypes[type].Icon;
    return <IconComponent className="w-5 h-5 text-tlco-purple" />;
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e]">
      {/* Top Navigation */}
      <nav className="bg-[#16162a] border-b border-tlco-purple/20">
        <div className="px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-xl font-semibold text-white">Current Promotions</h1>
          <div className="w-8" /> {/* Spacer for alignment */}
        </div>
      </nav>

      {/* Filters */}
      <div className="bg-[#16162a] border-b border-tlco-purple/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4">
          {/* Carrier Filter */}
          <div className="relative">
            <select
              value={selectedCarrier || ''}
              onChange={(e) => setSelectedCarrier(e.target.value as CarrierId || null)}
              className="appearance-none bg-[#1a1a2e] text-white border border-tlco-purple/30 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-tlco-purple"
            >
              <option value="">All Carriers</option>
              {carriers.map(carrier => (
                <option key={carrier.id} value={carrier.id}>{carrier.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Device Type Filter */}
          <div className="relative">
            <select
              value={selectedDeviceType || ''}
              onChange={(e) => setSelectedDeviceType(e.target.value as DeviceType || null)}
              className="appearance-none bg-[#1a1a2e] text-white border border-tlco-purple/30 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-tlco-purple"
            >
              <option value="">All Devices</option>
              {Object.entries(deviceTypes).map(([type, { label }]) => (
                <option key={type} value={type}>{label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Active Filters Display */}
          {(selectedCarrier || selectedDeviceType) && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Filter className="w-4 h-4 text-tlco-purple" />
              <span>
                Filtered by: {[
                  selectedCarrier && carriers.find(c => c.id === selectedCarrier)?.name,
                  selectedDeviceType && deviceTypes[selectedDeviceType].label
                ].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPromotions.map((promo) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#16162a] rounded-xl border border-tlco-purple/20 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">
                    {carriers.find(c => c.id === promo.carrierId)?.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    {renderDeviceIcon(promo.deviceType)}
                    <span className="text-sm text-gray-400">
                      {deviceTypes[promo.deviceType].label}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">{promo.title}</h3>
                <p className="text-gray-400 mb-4">{promo.description}</p>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-green-400">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>{promo.value}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Ends {new Date(promo.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-300">Requirements:</h4>
                  <ul className="space-y-1">
                    {promo.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-gray-400 flex items-start">
                        <Clock className="w-4 h-4 mr-2 mt-0.5 text-tlco-purple" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPromotions.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No promotions found for the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarrierPromos;