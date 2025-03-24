import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NewBlogPost from './pages/NewBlogPost';
import Agent from './pages/Agent';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import PlanComparison from './pages/PlanComparison';
import CarrierPromos from './pages/CarrierPromos';
import MyAccount from './pages/MyAccount';
import CertifiedDevices from './pages/CertifiedDevices';
import ResourceHub from './pages/ResourceHub';
import Deals from './pages/Deals';
import NewDeal from './pages/NewDeal';
import Customers from './pages/Customers';
import NewCustomer from './pages/NewCustomer';
import Reports from './pages/Reports';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <Router>
      <div className={`min-h-screen bg-background flex flex-col ${theme}`}>
        <Routes>
          {/* Dashboard Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="agent" element={<Agent />} />
            <Route path="plans" element={<PlanComparison />} />
            <Route path="promos" element={<CarrierPromos />} />
            <Route path="devices" element={<CertifiedDevices />} />
            <Route path="resources" element={<ResourceHub />} />
            <Route path="deals" element={<Deals />} />
            <Route path="deals/new" element={<NewDeal />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/new" element={<NewCustomer />} />
            <Route path="reports" element={<Reports />} />
            <Route path="account" element={<MyAccount />} />
          </Route>

          {/* Public Routes with Header and Footer */}
          <Route
            path="/*"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route
                      path="/blog/new"
                      element={
                        <ProtectedRoute>
                          <NewBlogPost />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/login" element={<Login />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;