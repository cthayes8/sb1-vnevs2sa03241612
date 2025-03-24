import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Building, 
  Phone, 
  Shield, 
  Bell, 
  ChevronLeft,
  LogOut,
  CheckCircle,
  XCircle,
  Lock
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserProfile {
  username: string;
  email: string;
  company: string;
  phone: string;
  role: string;
  notifications_enabled: boolean;
  two_factor_enabled: boolean;
}

const MyAccount = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('agent_users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile({
        username: profile.username || '',
        email: profile.email || '',
        company: profile.company || '',
        phone: profile.phone || '',
        role: profile.role || 'agent',
        notifications_enabled: profile.notifications_enabled || false,
        two_factor_enabled: profile.two_factor_enabled || false
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('agent_users')
        .update({
          company: profile.company,
          phone: profile.phone,
          notifications_enabled: profile.notifications_enabled,
          two_factor_enabled: profile.two_factor_enabled
        })
        .eq('id', user.id);

      if (error) throw error;

      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setPasswordError(null);
      setChangingPassword(true);

      if (newPassword !== confirmPassword) {
        setPasswordError('New passwords do not match');
        return;
      }

      if (newPassword.length < 8) {
        setPasswordError('Password must be at least 8 characters long');
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccessMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

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
          <h1 className="text-xl font-semibold text-foreground">My Account</h1>
          <button
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center text-destructive"
          >
            <XCircle className="w-5 h-5 mr-2" />
            {error}
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center text-emerald-200"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            {successMessage}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Profile Information */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Profile Information</h2>

              <div className="space-y-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <User className="w-4 h-4 inline-block mr-2" />
                    Username
                  </label>
                  <input
                    type="text"
                    value={profile?.username || ''}
                    disabled
                    className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground opacity-75"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <Mail className="w-4 h-4 inline-block mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground opacity-75"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <Building className="w-4 h-4 inline-block mr-2" />
                    Company
                  </label>
                  <input
                    type="text"
                    value={profile?.company || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, company: e.target.value } : null)}
                    className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <Phone className="w-4 h-4 inline-block mr-2" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profile?.phone || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                    className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <Shield className="w-4 h-4 inline-block mr-2" />
                    Role
                  </label>
                  <input
                    type="text"
                    value={profile?.role || ''}
                    disabled
                    className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground opacity-75"
                  />
                </div>

                {/* Settings */}
                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Settings</h3>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center">
                        <Bell className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Enable Notifications</span>
                      </div>
                      <div
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          profile?.notifications_enabled ? 'bg-primary' : 'bg-muted'
                        }`}
                        onClick={() => setProfile(prev => prev ? {
                          ...prev,
                          notifications_enabled: !prev.notifications_enabled
                        } : null)}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            profile?.notifications_enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Two-Factor Authentication</span>
                      </div>
                      <div
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          profile?.two_factor_enabled ? 'bg-primary' : 'bg-muted'
                        }`}
                        onClick={() => setProfile(prev => prev ? {
                          ...prev,
                          two_factor_enabled: !prev.two_factor_enabled
                        } : null)}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            profile?.two_factor_enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Change Password
              </h2>

              {passwordError && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                  {passwordError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={changingPassword || !newPassword || !confirmPassword}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
                >
                  {changingPassword ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;