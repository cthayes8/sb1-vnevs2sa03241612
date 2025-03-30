import { useState } from 'react';
import { motion } from 'framer-motion';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  MessageSquare, 
  BarChart3, 
  LogOut, 
  Users, 
  FileSpreadsheet, 
  Zap, 
  TrendingUp, 
  Menu, 
  User, 
  Smartphone, 
  Bell,
  FileText,
  FileDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNotificationStore } from '../store/notificationStore';
import NotificationPanel from '../components/NotificationPanel';
import ThemeToggle from '../components/ThemeToggle';

const menuItems = [
  {
    title: 'AI Sales Assistant',
    icon: MessageSquare,
    description: 'Get instant help with sales, quotes, and objections',
    path: '/dashboard/agent',
    highlight: true
  },
  {
    title: 'Plan Comparison',
    icon: FileSpreadsheet,
    description: 'Compare carrier plans side by side',
    path: '/dashboard/plans',
    highlight: true
  },
  {
    title: 'Sales Resources',
    icon: FileText,
    description: 'Access sales collateral and tools',
    path: '/dashboard/resources',
    highlight: true
  },
  {
    title: 'Carrier Promos',
    icon: Zap,
    description: 'Latest promotions from all carriers',
    path: '/dashboard/promos',
    highlight: true
  },
  {
    title: 'Certified Devices',
    icon: Smartphone,
    description: 'Browse certified devices by carrier',
    path: '/dashboard/devices',
    highlight: true
  },
  {
    title: 'My Deals',
    icon: TrendingUp,
    description: 'Track your sales and commissions',
    path: '/dashboard/deals',
    highlight: true
  },
  {
    title: 'Customers',
    icon: Users,
    description: 'Manage your customer relationships',
    path: '/dashboard/customers',
    highlight: true
  },
  {
    title: 'Reports',
    icon: FileDown,
    description: 'Generate and download reports',
    path: '/dashboard/reports',
    highlight: true
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    description: 'View your performance metrics',
    path: '/analytics',
    comingSoon: true
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const { notifications } = useNotificationStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAccountClick = () => {
    navigate('/dashboard/account');
  };

  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    const menuItem = menuItems.find(item => item.path === currentPath);
    return menuItem?.title || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-card border-r border-border
        transform lg:transform-none transition-transform duration-200
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Link 
          to="/dashboard"
          className="h-16 flex items-center px-4 border-b border-border hover:bg-primary/5 transition-colors"
        >
          <Zap className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold text-foreground">TLCO Portal</span>
        </Link>

        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => !item.comingSoon && navigate(item.path)}
              disabled={item.comingSoon}
              className={`
                w-full px-4 py-3 flex items-center space-x-3 relative group
                ${location.pathname === item.path ? 'bg-primary/10 border-r-2 border-primary' : ''}
                ${!item.comingSoon && 'hover:bg-primary/5'}
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200 rounded-lg mb-2
              `}
            >
              <item.icon className={`h-5 w-5 ${item.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="flex-1 text-left">
                <span className={`text-sm ${item.highlight ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.title}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              {item.comingSoon && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                  Soon
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <nav className="bg-card border-b border-border">
          <div className="px-4 h-16 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-muted-foreground hover:text-foreground mr-4"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-foreground">
                {getCurrentPageTitle()}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setIsNotificationPanelOpen(true)}
                className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-primary/10 transition-colors relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </motion.button>
              <ThemeToggle />
              <motion.button
                onClick={handleAccountClick}
                className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-primary/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="h-6 w-6" />
              </motion.button>
              <motion.button
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-primary/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* NotificationPanel */}
      <NotificationPanel 
        isOpen={isNotificationPanelOpen} 
        onClose={() => setIsNotificationPanelOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;