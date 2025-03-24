import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Users,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const NewCustomer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    industry: '',
    size: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: agentUser } = await supabase
        .from('agent_users')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!agentUser?.company_id) throw new Error('Company not found');

      const { error: insertError } = await supabase
        .from('customers')
        .insert([{
          ...formData,
          company_id: agentUser.company_id,
          created_by: user.id,
          assigned_to: user.id
        }]);

      if (insertError) throw insertError;

      navigate('/customers');
    } catch (error) {
      console.error('Error creating customer:', error);
      setError(error instanceof Error ? error.message : 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            <span>Back to Customers</span>
          </button>
          <h1 className="text-xl font-semibold text-foreground">New Customer</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 rounded-lg border border-destructive/30 text-destructive flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-muted-foreground mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  required
                  className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Address</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-muted-foreground mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-muted-foreground mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-muted-foreground mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-muted-foreground mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Additional Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-muted-foreground mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="size" className="block text-sm font-medium text-muted-foreground mb-1">
                  Company Size
                </label>
                <select
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-muted-foreground mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCustomer;