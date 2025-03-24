import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileCheck,
  Search,
  Download,
  ExternalLink,
  Menu,
  Filter,
  ChevronDown,
  Smartphone,
  Wifi,
  Router,
  Laptop,
  Tablet
} from 'lucide-react';

type ResourceType = 'flyer' | 'case_study' | 'business_case' | 'presentation' | 'guide';
type CarrierId = 'att' | 'verizon' | 'tmobile';
type DeviceType = 'phones' | 'tablets' | 'hotspots' | 'fixed_wireless' | 'laptops' | 'all';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  carrier: CarrierId;
  deviceType: DeviceType;
  fileUrl: string;
  fileType: string;
  dateAdded: string;
  downloads: number;
  tags: string[];
}

const resourceTypes: Record<ResourceType, { label: string; Icon: React.ComponentType<any> }> = {
  flyer: { label: 'Sales Flyers', Icon: FileImage },
  case_study: { label: 'Case Studies', Icon: FileCheck },
  business_case: { label: 'Business Cases', Icon: FileSpreadsheet },
  presentation: { label: 'Presentations', Icon: FileText },
  guide: { label: 'Sales Guides', Icon: FileText }
};

const deviceTypes: Record<DeviceType, { label: string; Icon: React.ComponentType<any> }> = {
  phones: { label: 'Phones', Icon: Smartphone },
  tablets: { label: 'Tablets', Icon: Tablet },
  hotspots: { label: 'Hotspots', Icon: Wifi },
  fixed_wireless: { label: 'Fixed Wireless', Icon: Router },
  laptops: { label: 'Laptops', Icon: Laptop },
  all: { label: 'All Devices', Icon: FileText }
};

const carriers = [
  { id: 'att' as CarrierId, name: 'AT&T' },
  { id: 'verizon' as CarrierId, name: 'Verizon' },
  { id: 'tmobile' as CarrierId, name: 'T-Mobile' }
];

// Sample resources data
const resources: Resource[] = [
  {
    id: '1',
    title: '5G Business Internet Overview',
    description: 'Comprehensive overview of 5G business internet solutions and benefits',
    type: 'flyer',
    carrier: 'att',
    deviceType: 'fixed_wireless',
    fileUrl: 'https://example.com/5g-overview.pdf',
    fileType: 'PDF',
    dateAdded: '2025-03-15',
    downloads: 156,
    tags: ['5G', 'Business Internet', 'Fixed Wireless']
  },
  {
    id: '2',
    title: 'Enterprise SD-WAN Success Story',
    description: 'How a national retailer transformed their network with SD-WAN',
    type: 'case_study',
    carrier: 'verizon',
    deviceType: 'fixed_wireless',
    fileUrl: 'https://example.com/sdwan-case-study.pdf',
    fileType: 'PDF',
    dateAdded: '2025-03-10',
    downloads: 89,
    tags: ['SD-WAN', 'Enterprise', 'Retail']
  },
  {
    id: '3',
    title: 'UCaaS ROI Calculator',
    description: 'Interactive tool to calculate UCaaS implementation savings',
    type: 'business_case',
    carrier: 'tmobile',
    deviceType: 'phones',
    fileUrl: 'https://example.com/ucaas-roi.xlsx',
    fileType: 'Excel',
    dateAdded: '2025-03-08',
    downloads: 234,
    tags: ['UCaaS', 'ROI', 'Calculator']
  },
  {
    id: '4',
    title: '5G Tablet Solutions Guide',
    description: 'Complete guide to enterprise tablet deployment and management',
    type: 'guide',
    carrier: 'att',
    deviceType: 'tablets',
    fileUrl: 'https://example.com/tablet-guide.pdf',
    fileType: 'PDF',
    dateAdded: '2025-03-05',
    downloads: 178,
    tags: ['Tablets', '5G', 'Enterprise Mobility']
  },
  {
    id: '5',
    title: 'Mobile Hotspot Comparison',
    description: 'Detailed comparison of enterprise mobile hotspot solutions',
    type: 'presentation',
    carrier: 'verizon',
    deviceType: 'hotspots',
    fileUrl: 'https://example.com/hotspot-comparison.pptx',
    fileType: 'PowerPoint',
    dateAdded: '2025-03-01',
    downloads: 145,
    tags: ['Hotspots', 'Mobile Internet', 'Comparison']
  }
];

const ResourceHub = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType | ''>('');
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierId | ''>('');
  const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceType>('all');
  const [sortBy, setSortBy] = useState<'date' | 'downloads'>('date');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter and sort resources
  const filteredResources = resources
    .filter(resource => {
      const matchesSearch = 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = !selectedType || resource.type === selectedType;
      const matchesCarrier = !selectedCarrier || resource.carrier === selectedCarrier;
      const matchesDevice = selectedDeviceType === 'all' || resource.deviceType === selectedDeviceType;
      return matchesSearch && matchesType && matchesCarrier && matchesDevice;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
      return b.downloads - a.downloads;
    });

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
          <h1 className="text-xl font-semibold text-white">Sales Resource Hub</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Filters and Search */}
      <div className="bg-[#16162a] border-b border-tlco-purple/20 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1a1a2e] text-white border border-tlco-purple/30 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-tlco-purple"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Device Type Filter */}
              <div className="relative">
                <select
                  value={selectedDeviceType}
                  onChange={(e) => setSelectedDeviceType(e.target.value as DeviceType)}
                  className="appearance-none bg-[#1a1a2e] text-white border border-tlco-purple/30 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-tlco-purple"
                >
                  {Object.entries(deviceTypes).map(([type, { label }]) => (
                    <option key={type} value={type}>{label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Resource Type Filter */}
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as ResourceType | '')}
                  className="appearance-none bg-[#1a1a2e] text-white border border-tlco-purple/30 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-tlco-purple"
                >
                  <option value="">All Types</option>
                  {Object.entries(resourceTypes).map(([type, { label }]) => (
                    <option key={type} value={type}>{label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Carrier Filter */}
              <div className="relative">
                <select
                  value={selectedCarrier}
                  onChange={(e) => setSelectedCarrier(e.target.value as CarrierId | '')}
                  className="appearance-none bg-[#1a1a2e] text-white border border-tlco-purple/30 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-tlco-purple"
                >
                  <option value="">All Carriers</option>
                  {carriers.map(carrier => (
                    <option key={carrier.id} value={carrier.id}>{carrier.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'downloads')}
                  className="appearance-none bg-[#1a1a2e] text-white border border-tlco-purple/30 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-tlco-purple"
                >
                  <option value="date">Newest First</option>
                  <option value="downloads">Most Downloaded</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const ResourceIcon = resourceTypes[resource.type].Icon;
            const DeviceIcon = deviceTypes[resource.deviceType].Icon;
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#16162a] rounded-xl border border-tlco-purple/20 overflow-hidden hover:border-tlco-purple/40 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">
                        {carriers.find(c => c.id === resource.carrier)?.name}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-tlco-purple/10 flex items-center justify-center">
                        <DeviceIcon className="w-4 h-4 text-tlco-purple" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Download className="w-4 h-4" />
                      <span>{resource.downloads}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-tlco-purple/10 flex items-center justify-center">
                      <ResourceIcon className="w-6 h-6 text-tlco-purple" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{resource.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-tlco-purple/10 text-tlco-purple text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      Added {new Date(resource.dateAdded).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-lg bg-tlco-purple text-white flex items-center space-x-1 hover:bg-tlco-purple/90 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{resource.fileType}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center text-gray-400 mt-12">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No resources found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceHub;