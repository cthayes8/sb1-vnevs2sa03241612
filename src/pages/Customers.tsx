import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Building,
  Phone,
  Mail,
  MapPin,
  Users,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          agent_users!customers_assigned_to_fkey (
            username
          )
        `)
        .order(sortBy, { ascending: false });

      if (error) throw error;
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <h1 className="text-xl font-semibold text-foreground">Customers</h1>
          <button
            onClick={() => navigate('/customers/new')}
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Customer</span>
          </button>
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
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background text-foreground border border-input rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-background text-foreground border border-input rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="created_at">Created Date</option>
                <option value="name">Name</option>
                <option value="company_name">Company</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="max-w-7xl mx-auto p-6">
        {error ? (
          <div className="text-center p-8 bg-destructive/10 rounded-lg border border-destructive/30">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <p className="text-destructive">{error}</p>
          </div>
        ) : loading ? (
          <div className="text-center text-muted-foreground">Loading customers...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No customers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/40 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">{customer.name}</h3>
                    {customer.agent_users && (
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{customer.agent_users.username}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <Building className="w-4 h-4 mr-2" />
                      <span>{customer.company_name}</span>
                    </div>
                    {customer.email && (
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="w-4 h-4 mr-2" />
                        <a href={`mailto:${customer.email}`} className="hover:text-primary">
                          {customer.email}
                        </a>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="w-4 h-4 mr-2" />
                        <a href={`tel:${customer.phone}`} className="hover:text-primary">
                          {customer.phone}
                        </a>
                      </div>
                    )}
                    {customer.city && customer.state && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{`${customer.city}, ${customer.state}`}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Added {format(new Date(customer.created_at), 'MMM d, yyyy')}
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

export default Customers;