import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Search,
  ChevronDown,
  Download,
  Wifi,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { CarrierId } from '../types/index';

interface RatePlan {
  id: string;
  "Carrier": CarrierId;
  "Plan Type": string;
  "Plan": string;
  "Price Per Line": number;
  "Premium Data": string | null;
  "Hotspot": string | null;
  "Video Streaming": string | null;
}

const PlanComparison = () => {
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierId | ''>('');
  const [selectedPlanType, setSelectedPlanType] = useState('');
  const [sortBy, setSortBy] = useState<'Price Per Line' | 'Plan Type'>('Price Per Line');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchRatePlans();
  }, []);

  const fetchRatePlans = async () => {
    try {
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from('rate_plans')
        .select('*')
        .order('Carrier')
        .order('Plan Type')
        .order('Price Per Line');

      if (supabaseError) throw supabaseError;
      setRatePlans(data || []);
    } catch (error) {
      console.error('Error fetching rate plans:', error);
      setError('Failed to load rate plans');
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = ratePlans.filter(plan => {
    const matchesSearch = 
      plan.Plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan["Plan Type"].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCarrier = !selectedCarrier || plan.Carrier === selectedCarrier;
    const matchesPlanType = !selectedPlanType || plan["Plan Type"] === selectedPlanType;
    return matchesSearch && matchesCarrier && matchesPlanType;
  }).sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'Price Per Line') {
      return (a["Price Per Line"] - b["Price Per Line"]) * multiplier;
    }
    return a[sortBy].localeCompare(b[sortBy]) * multiplier;
  });

  const uniquePlanTypes = [...new Set(ratePlans.map(plan => plan["Plan Type"]))];
  const carriers = [
    { id: 'att' as CarrierId, name: 'AT&T' },
    { id: 'verizon' as CarrierId, name: 'Verizon' },
    { id: 'tmobile' as CarrierId, name: 'T-Mobile' }
  ];

  return (
    <div className="flex-1 bg-background">
      {/* Filters and Search */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search plans..."
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
                  onChange={(e) => setSelectedCarrier(e.target.value as CarrierId | '')}
                  className="appearance-none bg-background text-foreground border border-input rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Carriers</option>
                  {carriers.map(carrier => (
                    <option key={carrier.id} value={carrier.id}>{carrier.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Plan Type Filter */}
              <div className="relative">
                <select
                  value={selectedPlanType}
                  onChange={(e) => setSelectedPlanType(e.target.value)}
                  className="appearance-none bg-background text-foreground border border-input rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Plan Types</option>
                  {uniquePlanTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'Price Per Line' | 'Plan Type')}
                  className="appearance-none bg-background text-foreground border border-input rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Price Per Line">Sort by Price</option>
                  <option value="Plan Type">Sort by Plan Type</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              <button
                onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto p-6">
        {error ? (
          <div className="text-center p-8 bg-destructive/10 rounded-lg border border-destructive/30">
            <p className="text-destructive">{error}</p>
          </div>
        ) : loading ? (
          <div className="text-center text-muted-foreground">Loading plans...</div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No plans found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/40 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-foreground">
                      {carriers.find(c => c.id === plan.Carrier)?.name}
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ${plan["Price Per Line"].toFixed(2)}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {plan.Plan}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {plan["Plan Type"]}
                  </p>

                  <div className="space-y-3">
                    {plan["Premium Data"] && (
                      <div className="flex items-center text-muted-foreground">
                        <Download className="w-4 h-4 mr-2 text-primary" />
                        <span>{plan["Premium Data"]}</span>
                      </div>
                    )}
                    {plan.Hotspot && (
                      <div className="flex items-center text-muted-foreground">
                        <Wifi className="w-4 h-4 mr-2 text-primary" />
                        <span>{plan.Hotspot}</span>
                      </div>
                    )}
                    {plan["Video Streaming"] && (
                      <div className="flex items-center text-muted-foreground">
                        <Globe className="w-4 h-4 mr-2 text-primary" />
                        <span>{plan["Video Streaming"]}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanComparison;