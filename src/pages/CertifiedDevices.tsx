import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Filter, ChevronDown, Smartphone, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Device {
  id: number;
  Carrier: string;
  Manufacturer: string;
  Model: string;
  Device: string;
  'Radio Technology': string[];
  'LTE Technology': string[];
  '5G Technology': string[];
  created_at: string;
}

// Headers for certified devices table
const tableHeaders = [
  { key: 'Carrier', label: 'Carrier', sortable: true },
  { key: 'Manufacturer', label: 'Manufacturer', sortable: true },
  { key: 'Model', label: 'Model', sortable: true },
  { key: 'Device', label: 'Device Type', sortable: true },
  { key: 'Radio Technology', label: 'Radio Technology', sortable: false },
  { key: 'LTE Technology', label: 'LTE Technology', sortable: false },
  { key: '5G Technology', label: '5G Technology', sortable: false }
];

const CertifiedDevices = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Manufacturer');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [carriers, setCarriers] = useState<string[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<string>('');
  const [deviceTypes, setDeviceTypes] = useState<string[]>([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [selectedTechnology, setSelectedTechnology] = useState<string>('');

  useEffect(() => {
    fetchDevices();
  }, [sortBy, sortOrder]);

  useEffect(() => {
    if (devices.length > 0) {
      // Extract unique values for filters
      const uniqueCarriers = [...new Set(devices.map(device => device.Carrier))].filter(Boolean).sort();
      const uniqueDeviceTypes = [...new Set(devices.map(device => device.Device))].filter(Boolean).sort();
      const uniqueTechnologies = [...new Set(devices.flatMap(device => {
        const techs = [];
        if (device['Radio Technology']) techs.push(...device['Radio Technology']);
        if (device['LTE Technology']) techs.push(...device['LTE Technology']);
        if (device['5G Technology']) techs.push(...device['5G Technology']);
        return techs;
      }))].filter(Boolean).sort();

      setCarriers(uniqueCarriers);
      setDeviceTypes(uniqueDeviceTypes);
      setTechnologies(uniqueTechnologies);
    }
  }, [devices]);

  const fetchDevices = async () => {
    try {
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from('certified_devices')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' });

      if (supabaseError) throw supabaseError;
      setDevices(data || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setError('Failed to load certified devices');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    if (key === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const resetFilters = () => {
    setSelectedCarrier('');
    setSelectedDeviceType('');
    setSelectedTechnology('');
    setSearchTerm('');
  };

  const filteredDevices = devices.filter(device => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      device.Manufacturer?.toLowerCase().includes(searchLower) ||
      device.Model?.toLowerCase().includes(searchLower) ||
      device.Device?.toLowerCase().includes(searchLower);

    const matchesCarrier = !selectedCarrier || device.Carrier === selectedCarrier;
    const matchesDeviceType = !selectedDeviceType || device.Device === selectedDeviceType;
    const matchesTechnology = !selectedTechnology || 
      [...(device['Radio Technology'] || []), 
       ...(device['LTE Technology'] || []), 
       ...(device['5G Technology'] || [])]
        .join(',')
        .toLowerCase()
        .includes(selectedTechnology.toLowerCase());

    return matchesSearch && matchesCarrier && matchesDeviceType && matchesTechnology;
  });

  const activeFilters = [
    selectedCarrier && `Carrier: ${selectedCarrier}`,
    selectedDeviceType && `Type: ${selectedDeviceType}`,
    selectedTechnology && `Tech: ${selectedTechnology}`,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-xl font-semibold text-foreground">Certified Devices</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </nav>

      {/* Filters and Search */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background text-foreground border border-input rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Carrier Filter */}
              <div className="relative">
                <select
                  value={selectedCarrier}
                  onChange={(e) => setSelectedCarrier(e.target.value)}
                  className="appearance-none bg-background text-foreground border border-input rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Carriers</option>
                  {carriers.map(carrier => (
                    <option key={carrier} value={carrier}>{carrier}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Device Type Filter */}
              <div className="relative">
                <select
                  value={selectedDeviceType}
                  onChange={(e) => setSelectedDeviceType(e.target.value)}
                  className="appearance-none bg-background text-foreground border border-input rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Device Types</option>
                  {deviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Technology Filter */}
              <div className="relative">
                <select
                  value={selectedTechnology}
                  onChange={(e) => setSelectedTechnology(e.target.value)}
                  className="appearance-none bg-background text-foreground border border-input rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Technologies</option>
                  {technologies.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Reset Filters */}
              {activeFilters.length > 0 && (
                <button
                  onClick={resetFilters}
                  className="flex items-center space-x-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilters.length > 0 && (
            <div className="flex items-center space-x-2 mt-4 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <span key={filter} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {filter}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Devices Table */}
      <div className="max-w-7xl mx-auto p-6">
        {error ? (
          <div className="text-center p-8 bg-destructive/10 rounded-lg border border-destructive/30">
            <p className="text-destructive">{error}</p>
          </div>
        ) : loading ? (
          <div className="text-center text-muted-foreground">Loading devices...</div>
        ) : filteredDevices.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No devices found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  {tableHeaders.map(header => (
                    <th
                      key={header.key}
                      className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-b border-border"
                    >
                      <button
                        className={`flex items-center space-x-1 ${header.sortable ? 'cursor-pointer hover:text-foreground' : ''}`}
                        onClick={() => header.sortable && handleSort(header.key)}
                        disabled={!header.sortable}
                      >
                        <span>{header.label}</span>
                        {header.sortable && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              sortBy === header.key && sortOrder === 'desc' ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device, index) => (
                  <motion.tr
                    key={device.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 text-sm">{device.Carrier}</td>
                    <td className="px-4 py-3 text-sm">{device.Manufacturer}</td>
                    <td className="px-4 py-3 text-sm">{device.Model}</td>
                    <td className="px-4 py-3 text-sm">{device.Device}</td>
                    <td className="px-4 py-3 text-sm">{Array.isArray(device['Radio Technology']) ? device['Radio Technology'].join(', ') : device['Radio Technology']}</td>
                    <td className="px-4 py-3 text-sm">{Array.isArray(device['LTE Technology']) ? device['LTE Technology'].join(', ') : device['LTE Technology']}</td>
                    <td className="px-4 py-3 text-sm">{Array.isArray(device['5G Technology']) ? device['5G Technology'].join(', ') : device['5G Technology']}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertifiedDevices;