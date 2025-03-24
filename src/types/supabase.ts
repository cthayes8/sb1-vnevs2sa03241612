export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          company_id: string
          name: string
          company_name: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          postal_code: string | null
          country: string
          industry: string | null
          size: string | null
          notes: string | null
          assigned_to: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          company_name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string
          industry?: string | null
          size?: string | null
          notes?: string | null
          assigned_to?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          company_name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string
          industry?: string | null
          size?: string | null
          notes?: string | null
          assigned_to?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      deals: {
        Row: {
          id: string
          company_id: string
          customer_id: string
          title: string
          description: string | null
          status: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
          value: number
          close_date: string | null
          probability: number
          carrier: 'att' | 'verizon' | 'tmobile'
          product_type: string
          contract_term: number | null
          monthly_revenue: number | null
          one_time_revenue: number | null
          total_revenue: number | null
          assigned_to: string | null
          created_by: string
          created_at: string
          updated_at: string
          closed_at: string | null
          lost_reason: string | null
        }
        Insert: {
          id?: string
          company_id: string
          customer_id: string
          title: string
          description?: string | null
          status?: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
          value?: number
          close_date?: string | null
          probability?: number
          carrier: 'att' | 'verizon' | 'tmobile'
          product_type: string
          contract_term?: number | null
          monthly_revenue?: number | null
          one_time_revenue?: number | null
          total_revenue?: number | null
          assigned_to?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          closed_at?: string | null
          lost_reason?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          customer_id?: string
          title?: string
          description?: string | null
          status?: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
          value?: number
          close_date?: string | null
          probability?: number
          carrier?: 'att' | 'verizon' | 'tmobile'
          product_type?: string
          contract_term?: number | null
          monthly_revenue?: number | null
          one_time_revenue?: number | null
          total_revenue?: number | null
          assigned_to?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          closed_at?: string | null
          lost_reason?: string | null
        }
      }
      deal_activities: {
        Row: {
          id: string
          deal_id: string
          type: string
          description: string
          performed_by: string
          performed_at: string
        }
        Insert: {
          id?: string
          deal_id: string
          type: string
          description: string
          performed_by: string
          performed_at?: string
        }
        Update: {
          id?: string
          deal_id?: string
          type?: string
          description?: string
          performed_by?: string
          performed_at?: string
        }
      }
    }
  }
}