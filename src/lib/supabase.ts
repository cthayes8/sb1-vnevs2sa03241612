import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Get environment variables
const supabaseUrl = 'https://bcolbzrvrvkpacznstru.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjb2xienJ2cnZrcGFjem5zdHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDM4MzcsImV4cCI6MjA1NzM3OTgzN30.82H17DeoxTM9X2Oig2YZrWPAA471jv5QwUYkQJSsDP4';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Test the connection and configuration
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('count')
      .single();
    
    if (error) {
      console.error('Connection test error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
};