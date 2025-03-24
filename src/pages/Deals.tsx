import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Download,
  Filter,
  ChevronDown,
  DollarSign,
  Calendar,
  Users,
  Building,
  Phone,
  Mail,
  MapPin,
  Tag,
  Clock,
  AlertCircle,
  Search
} from 'lucide-react';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

// Deal status configuration - removed closed_lost
const dealStatuses = [
  { value: 'lead', label: 'Lead', color: 'bg-blue-500' },
  { value: 'qualified', label: 'Qualified', color: 'bg-purple-500' },
  { value: 'proposal', label: 'Proposal', color: 'bg-yellow-500' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
  { value: 'closed_won', label: 'Won', color: 'bg-green-500' }
];

const Deals = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [error, setError] = useState(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          customers (
            name,
            company_name
          ),
          agent_users!deals_assigned_to_fkey (
            username
          )
        `)
        .neq('status', 'closed_lost') // Exclude lost deals
        .order(sortBy, { ascending: false });

      if (error) throw error;
      setDeals(data);
    } catch (error) {
      console.error('Error fetching deals:', error);
      setError('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const dealId = active.id;
    const newStatus = over.id;

    try {
      const { error } = await supabase
        .from('deals')
        .update({ status: newStatus })
        .eq('id', dealId);

      if (error) throw error;

      // Update local state
      setDeals(deals.map(deal => 
        deal.id === dealId ? { ...deal, status: newStatus } : deal
      ));
    } catch (error) {
      console.error('Error updating deal status:', error);
    }
  };

  const getStatusColor = (status) => {
    const statusConfig = dealStatuses.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-500';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const exportToExcel = () => {
    const exportData = deals.map(deal => ({
      'Deal Title': deal.title,
      'Customer': deal.customers?.company_name,
      'Status': dealStatuses.find(s => s.value === deal.status)?.label,
      'Value': formatCurrency(deal.value),
      'Close Date': deal.close_date ? format(new Date(deal.close_date), 'MMM d, yyyy') : '',
      'Probability': `${deal.probability}%`,
      'Carrier': deal.carrier,
      'Product Type': deal.product_type,
      'Monthly Revenue': deal.monthly_revenue ? formatCurrency(deal.monthly_revenue) : '',
      'One Time Revenue': deal.one_time_revenue ? formatCurrency(deal.one_time_revenue) : '',
      'Total Revenue': deal.total_revenue ? formatCurrency(deal.total_revenue) : '',
      'Assigned To': deal.agent_users?.username,
      'Created At': format(new Date(deal.created_at), 'MMM d, yyyy')
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Deals');
    XLSX.writeFile(wb, `deals_export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = 
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.customers?.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || deal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const dealsByStatus = dealStatuses.reduce((acc, status) => {
    acc[status.value] = filteredDeals.filter(deal => deal.status === status.value);
    return acc;
  }, {});

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
          <h1 className="text-xl font-semibold text-foreground">Deals</h1>
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={exportToExcel}
              className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
            <Link
              to="/dashboard/deals/new"
              className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Deal</span>
            </Link>
          </div>
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
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background text-foreground border border-input rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-background text-foreground border border-input rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Statuses</option>
                {dealStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-background text-foreground border border-input rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="created_at">Created Date</option>
                <option value="close_date">Close Date</option>
                <option value="value">Deal Value</option>
                <option value="probability">Probability</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-6">
        {error ? (
          <div className="text-center p-8 bg-destructive/10 rounded-lg border border-destructive/30">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <p className="text-destructive">{error}</p>
          </div>
        ) : loading ? (
          <div className="text-center text-muted-foreground">Loading deals...</div>
        ) : (
          <DndContext
            sensors={sensors}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-5 gap-4">
              {dealStatuses.map(status => (
                <div
                  key={status.value}
                  className="min-w-[280px]"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${status.color}`} />
                      <h3 className="font-semibold text-foreground">{status.label}</h3>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {dealsByStatus[status.value].length}
                    </span>
                  </div>

                  <div
                    id={status.value}
                    className="space-y-4"
                  >
                    {dealsByStatus[status.value].map((deal) => (
                      <motion.div
                        key={deal.id}
                        layoutId={deal.id}
                        className="bg-card rounded-lg border border-border p-4 cursor-move hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-semibold text-foreground">
                            {formatCurrency(deal.value)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {deal.probability}% probability
                          </span>
                        </div>

                        <h3 className="font-medium text-foreground mb-2">{deal.title}</h3>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center text-muted-foreground">
                            <Building className="w-4 h-4 mr-2" />
                            <span>{deal.customers?.company_name}</span>
                          </div>
                          {deal.close_date && (
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>Close: {format(new Date(deal.close_date), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{format(new Date(deal.created_at), 'MMM d')}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{deal.agent_users?.username || 'Unassigned'}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default Deals;