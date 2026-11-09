import { readJsonFile, writeJsonFile } from './json-db';
import { createAdminClient } from './supabase/admin';
import { isSupabaseConfigured } from './supabase/status';

export interface CustomEnquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  occasion?: string;
  neededByDate?: string;
  budgetEstimate?: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'QUOTED' | 'ACCEPTED' | 'DECLINED' | 'CLOSED';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const ENQUIRIES_FILE = 'enquiries.json';

export const SEED_ENQUIRIES: CustomEnquiry[] = [];

export function getEnquiries(): CustomEnquiry[] {
  return readJsonFile<CustomEnquiry[]>(ENQUIRIES_FILE, []);
}

export function saveEnquiry(enquiry: Omit<CustomEnquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>): CustomEnquiry {
  const enquiries = getEnquiries();
  const newEnquiry: CustomEnquiry = {
    ...enquiry,
    id: `enq-${Date.now()}`,
    status: 'NEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  enquiries.unshift(newEnquiry);
  writeJsonFile(ENQUIRIES_FILE, enquiries);
  return newEnquiry;
}

export function updateEnquiryStatus(
  id: string,
  newStatus: CustomEnquiry['status'],
  notes?: string
): CustomEnquiry | null {
  const enquiries = getEnquiries();
  const index = enquiries.findIndex((e) => e.id === id);
  if (index === -1) return null;

  enquiries[index] = {
    ...enquiries[index],
    status: newStatus,
    adminNotes: notes !== undefined ? notes : enquiries[index].adminNotes,
    updatedAt: new Date().toISOString(),
  };

  writeJsonFile(ENQUIRIES_FILE, enquiries);
  return enquiries[index];
}

export async function getEnquiriesAsync(): Promise<CustomEnquiry[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          customerName: d.customer_name,
          customerPhone: d.customer_phone,
          message: d.message,
          budgetEstimate: d.budget_estimate || undefined,
          neededByDate: d.needed_by_date || undefined,
          status: d.status || 'NEW',
          adminNotes: d.admin_notes || undefined,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch {
      // Fall back to JSON
    }
  }
  return getEnquiries();
}

export async function saveEnquiryAsync(
  enquiry: Omit<CustomEnquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<CustomEnquiry> {
  const saved = saveEnquiry(enquiry);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase.from('enquiries').insert({
        customer_name: enquiry.customerName,
        customer_phone: enquiry.customerPhone,
        message: enquiry.message,
        budget_estimate: enquiry.budgetEstimate || null,
        needed_by_date: enquiry.neededByDate || null,
        status: 'NEW',
      });
    } catch {
      // JSON already saved
    }
  }
  return saved;
}

export async function updateEnquiryStatusAsync(
  id: string,
  newStatus: CustomEnquiry['status'],
  notes?: string
): Promise<CustomEnquiry | null> {
  const updated = updateEnquiryStatus(id, newStatus, notes);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const payload: Record<string, any> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };
      if (notes !== undefined) payload.admin_notes = notes;
      await supabase.from('enquiries').update(payload).eq('id', id);
    } catch {
      // JSON already updated
    }
  }
  return updated;
}
