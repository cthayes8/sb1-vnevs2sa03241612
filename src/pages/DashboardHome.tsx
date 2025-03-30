import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  MessageSquare,
  FileSpreadsheet,
  Zap,
  Smartphone,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Building
} from 'lucide-react';

// Sample data for demonstration
const metrics = {
  deals: {
    total: 125,
    change: 12,
    trend: 'up',
    period: 'vs last month'
  },
  revenue: {
    total: 156000,
    change: 8.5,
    trend: 'up',
    period: 'vs last month'
  },
  customers: {
    total: 48,
    change: -3,
    trend: 'down',
    period: 'vs last month'
  },
  closeRate: {
    total: 68,
    change: 5,
    trend: 'up',
    period: 'vs last month'
  }
};

const recentDeals = [
  {
    id: '1',
    customer: 'Acme Corp',
    value: 25000,
    status: 'qualified',
    date: '2025-03-21'
  },
  {
    id: '2',
    customer: 'TechStart Inc',
    value: 18500,
    status: 'proposal',
    date: '2025-03-20'
  },
  {
    id: '3',
    customer: 'Global Services LLC',
    value: 42000,
    status: 'negotiation',
    date: '2025-03-19'
  }
];

const quickActions = [
  {
    title: 'AI Assistant',
    description: 'Get instant help with quotes and objections',
    icon: MessageSquare,
    path: '/dashboard/agent',
    color: 'bg-purple-500'
  },
  {
    title: 'Compare Plans',
    description: 'View and compare carrier plans',
    icon: FileSpreadsheet,
    path: '/dashboard/plans',
    color: 'bg-blue-500'
  },
  {
    title: 'Promotions',
    description: 'See latest carrier promotions',
    icon: Zap,
    path: '/dashboard/promos',
    color: 'bg-amber-500'
  },
  {
    title: 'Devices',
    description: 'Browse certified devices',
    icon: Smartphone,
    path: '/dashboard/devices',
    color: 'bg-green-500'
  }
];

const DashboardHome = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Message */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Welcome back, Agent! 👋</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your sales</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Deals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              {metrics.deals.trend === 'up' ? (
                <div className="flex items-center text-emerald-500">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+{metrics.deals.change}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span>{metrics.deals.change}%</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-muted-foreground font-medium">Active Deals</h3>
              <p className="text-3xl font-semibold text-foreground mt-1">{metrics.deals.total}</p>
              <p className="text-sm text-muted-foreground mt-1">{metrics.deals.period}</p>
            </div>
          </motion.div>

          {/* Monthly Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              {metrics.revenue.trend === 'up' ? (
                <div className="flex items-center text-emerald-500">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+{metrics.revenue.change}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span>{metrics.revenue.change}%</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-muted-foreground font-medium">Monthly Revenue</h3>
              <p className="text-3xl font-semibold text-foreground mt-1">
                ${metrics.revenue.total.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{metrics.revenue.period}</p>
            </div>
          </motion.div>

          {/* New Customers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              {metrics.customers.trend === 'up' ? (
                <div className="flex items-center text-emerald-500">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+{metrics.customers.change}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span>{metrics.customers.change}%</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-muted-foreground font-medium">New Customers</h3>
              <p className="text-3xl font-semibold text-foreground mt-1">{metrics.customers.total}</p>
              <p className="text-sm text-muted-foreground mt-1">{metrics.customers.period}</p>
            </div>
          </motion.div>

          {/* Close Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              {metrics.closeRate.trend === 'up' ? (
                <div className="flex items-center text-emerald-500">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span>+{metrics.closeRate.change}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  <span>{metrics.closeRate.change}%</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-muted-foreground font-medium">Close Rate</h3>
              <p className="text-3xl font-semibold text-foreground mt-1">{metrics.closeRate.total}%</p>
              <p className="text-sm text-muted-foreground mt-1">{metrics.closeRate.period}</p>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <motion.a
                  key={action.title}
                  href={action.path}
                  className="flex items-start p-4 rounded-lg border border-border hover:border-primary/40 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} bg-opacity-10 flex items-center justify-center mr-4`}>
                    <action.icon className={`w-5 h-5 ${action.color} text-opacity-100`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Deals</h2>
            <div className="space-y-4">
              {recentDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{deal.customer}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(deal.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      ${deal.value.toLocaleString()}
                    </p>
                    <span className="text-sm text-muted-foreground capitalize">
                      {deal.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;