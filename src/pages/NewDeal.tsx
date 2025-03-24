import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Building,
  Globe,
  Phone,
  Calendar,
  DollarSign,
  Radio,
  Smartphone,
  Wifi,
  Router,
  AlertCircle,
  FileText
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface DealFormData {
  // Company Information
  customer_name: string;
  company_name: string;
  company_address: string;
  company_website: string;

  // Opportunity Information
  voice_lines: number;
  mobile_internet_lines: number;
  fixed_wireless_lines: number;

  // Opportunity Details
  use_case: string;
  hardware_source: 'customer' | 'carrier' | 'third_party';
  partner_solution: string;
  device_type: string;
  close_date: string;

  // Rate Plan Details (Optional)
  carrier: string;
  rate_plan_id?: string;
  monthly_rate?: number;
  contract_term?: number;

  // Deal Information
  title: string;
  description: string;
  status: string;
  stage: string;
  probability: number;
}

const NewDeal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ratePlans, setRatePlans] = useState([]);
  const [formData, setFormData] = useState<DealFormData>({
    customer_name: '',
    company_name: '',
    company_address: '',
    company_website: '',
    voice_lines: 0,
    mobile_internet_lines: 0,
    fixed_wireless_lines: 0,
    use_case: '',
    hardware_source: 'carrier',
    partner_solution: '',
    device_type: '',
    close_date: format(new Date().setDate(new Date().getDate() + 30), 'yyyy-MM-dd'),
    carrier: 'ATT',
    title: '',
    description: '',
    status: 'lead',
    stage: 'discovery',
    probability: 20
  });

  useEffect(() => {
    fetchRatePlans();
  }, [formData.carrier]); // Refetch when carrier changes

  const fetchRatePlans = async () => {
    try {
      const { data, error } = await supabase
        .from('rate_plans')
        .select('*')
        .eq('Carrier', formData.carrier)
        .order('Plan Type')
        .order('Price Per Line');

      if (error) throw error;
      setRatePlans(data || []);
    } catch (error) {
      console.error('Error fetching rate plans:', error);
    }
  };

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

      // First create the customer
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert([{
          company_id: agentUser.company_id,
          name: formData.customer_name,
          company_name: formData.company_name,
          company_website: formData.company_website,
          created_by: user.id,
          assigned_to: user.id
        }])
        .select()
        .single();

      if (customerError) throw customerError;

      // Calculate total value based on lines and rate plan
      const monthlyRevenue = (formData.voice_lines + formData.mobile_internet_lines + formData.fixed_wireless_lines) * 
        (formData.monthly_rate || 0);
      const totalValue = monthlyRevenue * (formData.contract_term || 24);

      // Then create the deal
      const { error: dealError } = await supabase
        .from('deals')
        .insert([{
          company_id: agentUser.company_id,
          customer_id: customerData.id,
          title: formData.title,
          description: formData.description,
          status: formData.status,
          stage: formData.stage,
          value: totalValue,
          close_date: formData.close_date,
          probability: formData.probability,
          carrier: formData.carrier,
          product_type: formData.device_type,
          contract_term: formData.contract_term,
          monthly_revenue: monthlyRevenue,
          created_by: user.id,
          assigned_to: user.id,
          metadata: {
            voice_lines: formData.voice_lines,
            mobile_internet_lines: formData.mobile_internet_lines,
            fixed_wireless_lines: formData.fixed_wireless_lines,
            use_case: formData.use_case,
            hardware_source: formData.hardware_source,
            partner_solution: formData.partner_solution,
            rate_plan_id: formData.rate_plan_id
          }
        }]);

      if (dealError) throw dealError;

      navigate('/dashboard/deals');
    } catch (error) {
      console.error('Error creating deal:', error);
      setError(error instanceof Error ? error.message : 'Failed to create deal');
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
            onClick={() => navigate('/dashboard/deals')}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            <span>Back to Deals</span>
          </button>
          <h1 className="text-xl font-semibold text-foreground">New Deal</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 rounded-lg border border-destructive/30 text-destructive flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Company Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="customer_name" className="block text-sm font-medium text-muted-foreground mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  required
                  className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter contact name"
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
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label htmlFor="company_website" className="block text-sm font-medium text-muted-foreground mb-1">
                  Company Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="url"
                    id="company_website"
                    value={formData.company_website}
                    onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                    className="w-full bg-background text-foreground border border-input rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Opportunity Information */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Opportunity Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="voice_lines" className="block text-sm font-medium text-muted-foreground mb-1">
                  Voice Lines
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="number"
                    id="voice_lines"
                    min="0"
                    value={formData.voice_lines}
                    onChange={(e) => setFormData({ ...formData, voice_lines: parseInt(e.target.value) || 0 })}
                    className="w-full bg-background text-foreground border border-input rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mobile_internet_lines" className="block text-sm font-medium text-muted-foreground mb-1">
                  Mobile Internet Lines
                </label>
                <div className="relative">
                  <Wifi className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="number"
                    id="mobile_internet_lines"
                    min="0"
                    value={formData.mobile_internet_lines}
                    onChange={(e) => setFormData({ ...formData, mobile_internet_lines: parseInt(e.target.value) || 0 })}
                    className="w-full bg-background text-foreground border border-input rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="fixed_wireless_lines" className="block text-sm font-medium text-muted-foreground mb-1">
                  Fixed Wireless Lines
                </label>
                <div className="relative">
                  <Router className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="number"
                    id="fixed_wireless_lines"
                    min="0"
                    value={formData.fixed_wireless_lines}
                    onChange={(e) => setFormData({ ...formData, fixed_wireless_lines: parseInt(e.target.value) || 0 })}
                    className="w-full bg-background text-foreground border border-input rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Opportunity Details */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Opportunity Details</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="use_case" className="block text-sm font-medium text-muted-foreground mb-1">
                  Use Case
                </label>
                <textarea
                  id="use_case"
                  value={formData.use_case}
                  onChange={(e) => setFormData({ ...formData, use_case: e.target.value })}
                  rows={3}
                  className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Describe the customer's use case and requirements..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hardware_source" className="block text-sm font-medium text-muted-foreground mb-1">
                    Hardware Source
                  </label>
                  <select
                    id="hardware_source"
                    value={formData.hardware_source}
                    onChange={(e) => setFormData({ ...formData, hardware_source: e.target.value as 'customer' | 'carrier' | 'third_party' })}
                    className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="carrier">Carrier Provided</option>
                    <option value="customer">Customer Provided</option>
                    <option value="third_party">Third Party</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="device_type" className="block text-sm font-medium text-muted-foreground mb-1">
                    Device Type
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="text"
                      id="device_type"
                      value={formData.device_type}
                      onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                      className="w-full bg-background text-foreground border border-input rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="e.g., Smartphone, Tablet, Router"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="partner_solution" className="block text-sm font-medium text-muted-foreground mb-1">
                  Partner Solution
                </label>
                <input
                  type="text"
                  id="partner_solution"
                  value={formData.partner_solution}
                  onChange={(e) => setFormData({ ...formData, partner_solution: e.target.value })}
                  className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Any partner solutions or integrations required"
                />
              </div>

              <div>
                <label htmlFor="close_date" className="block text-sm font-medium text-muted-foreground mb-1">
                  Expected Close Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="date"
                    id="close_date"
                    value={formData.close_date}
                    onChange={(e) => setFormData({ ...formData, close_date: e.target.value })}
                    className="w-full bg-background text-foreground border border-input rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rate Plan Details (Optional) */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Rate Plan Details (Optional)</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="carrier" className="block text-sm font-medium text-muted-foreground mb-1">
                  Carrier
                </label>
                <select
                  id="carrier"
                  value={formData.carrier}
                  onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                  required
                  className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="ATT">AT&T</option>
                  <option value="VERIZON">Verizon</option>
                  <option value="TMOBILE">T-Mobile</option>
                </select>
              </div>

              <div>
                <label htmlFor="rate_plan_id" className="block text-sm font-medium text-muted-foreground mb-1">
                  Select Rate Plan
                </label>
                <select
                  id="rate_plan_id"
                  value={formData.rate_plan_id}
                  onChange={(e) => {
                    const plan = ratePlans.find(p => p.id === e.target.value);
                    setFormData({
                      ...formData,
                      rate_plan_id: e.target.value,
                      monthly_rate: plan ? plan['Price Per Line'] : undefined
                    });
                  }}
                  className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a rate plan</option>
                  {ratePlans.map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.Plan} - ${plan['Price Per Line']}/mo
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="monthly_rate" className="block text-sm font-medium text-muted-foreground mb-1">
                    Monthly Rate per Line
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="number"
                      id="monthly_rate"
                      min="0"
                      step="0.01"
                      value={formData.monthly_rate}
                      onChange={(e) => setFormData({ ...formData, monthly_rate: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-background text-foreground border border-input rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contract_term" className="block text-sm font-medium text-muted-foreground mb-1">
                    Contract Term (months)
                  </label>
                  <input
                    type="number"
                    id="contract_term"
                    min="0"
                    value={formData.contract_term}
                    onChange={(e) => setFormData({ ...formData, contract_term: parseInt(e.target.value) || 0 })}
                    className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Deal Information */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Deal Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-1">
                  Deal Title
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-background text-foreground border border-input rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter a descriptive title for this deal"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Add any additional details about the deal..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-muted-foreground mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                    className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="lead">Lead</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="closed_won">Closed Won</option>
                    <option value="closed_lost">Closed Lost</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="stage" className="block text-sm font-medium text-muted-foreground mb-1">
                    Stage
                  </label>
                  <select
                    id="stage"
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    required
                    className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="discovery">Discovery</option>
                    <option value="qualification">Qualification</option>
                    <option value="solution">Solution Design</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="closing">Closing</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="probability" className="block text-sm font-medium text-muted-foreground mb-1">
                    Probability (%)
                  </label>
                  <input
                    type="number"
                    id="probability"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full bg-background text-foreground border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <motion.button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? 'Creating...' : 'Create Deal'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDeal;