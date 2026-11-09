import { readJsonFile, writeJsonFile } from './json-db';
import { createAdminClient } from './supabase/admin';
import { isSupabaseConfigured } from './supabase/status';

export interface StoreSettings {
  storeName: string;
  announcementText: string;
  announcementVisible: boolean;
  whatsappNumber: string;
  instagramHandle: string;
  heroBadgeText: string;
  heroTitle: string;
  heroSubtitle: string;
  deliveryFee: number;
  updatedAt: string;
}

const SETTINGS_FILE = 'settings.json';

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Bloomora',
  announcementText:
    'Bloomora • Handcrafted with love in Vadodara • City-Wide Delivery across all PIN codes • WhatsApp: +91 8271735190',
  announcementVisible: true,
  whatsappNumber: '918271735190',
  instagramHandle: 'bloomora.creation',
  heroBadgeText: "Vadodara's Artisan Studio • Slow Handcrafted Blooms",
  heroTitle: 'Little details. Beautiful emotions.',
  heroSubtitle:
    'Thoughtfully crocheted everlasting flowers, bespoke bouquets, and keepsake charms. Each piece is slow-crafted stitch by stitch with warmth, patient care, and genuine feeling in Vadodara, Gujarat.',
  deliveryFee: 50,
  updatedAt: '2026-11-09T00:00:00Z',
};

export function getSettings(): StoreSettings {
  return readJsonFile<StoreSettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
}

export async function getSettingsAsync(): Promise<StoreSettings> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.from('site_settings').select('*');
      if (!error && data && data.length > 0) {
        const map: Record<string, any> = {};
        for (const row of data) {
          try {
            map[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
          } catch {
            map[row.key] = row.value;
          }
        }
        return {
          storeName: map.store_name || DEFAULT_SETTINGS.storeName,
          announcementText: map.announcement_text || DEFAULT_SETTINGS.announcementText,
          announcementVisible: map.announcement_visible !== false,
          whatsappNumber: map.business_whatsapp_number || map.whatsapp_number || DEFAULT_SETTINGS.whatsappNumber,
          instagramHandle: map.instagram_handle || DEFAULT_SETTINGS.instagramHandle,
          heroBadgeText: map.hero_badge_text || DEFAULT_SETTINGS.heroBadgeText,
          heroTitle: map.hero_title || DEFAULT_SETTINGS.heroTitle,
          heroSubtitle: map.hero_subtitle || DEFAULT_SETTINGS.heroSubtitle,
          deliveryFee: typeof map.default_delivery_fee === 'number' ? map.default_delivery_fee : DEFAULT_SETTINGS.deliveryFee,
          updatedAt: new Date().toISOString(),
        };
      }
    } catch {
      // Fall back to local JSON
    }
  }
  return getSettings();
}

export function saveSettings(updates: Partial<StoreSettings>): StoreSettings {
  const current = getSettings();
  const updated: StoreSettings = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile(SETTINGS_FILE, updated);
  return updated;
}

export async function saveSettingsAsync(updates: Partial<StoreSettings>): Promise<StoreSettings> {
  const updated = saveSettings(updates);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const rows = [
        { key: 'store_name', value: JSON.stringify(updated.storeName) },
        { key: 'announcement_text', value: JSON.stringify(updated.announcementText) },
        { key: 'business_whatsapp_number', value: JSON.stringify(updated.whatsappNumber) },
        { key: 'instagram_handle', value: JSON.stringify(updated.instagramHandle) },
        { key: 'default_delivery_fee', value: JSON.stringify(updated.deliveryFee) },
        { key: 'hero_badge_text', value: JSON.stringify(updated.heroBadgeText) },
      ];
      for (const row of rows) {
        await supabase.from('site_settings').upsert(row, { onConflict: 'key' });
      }
    } catch {
      // JSON fallback already persisted
    }
  }
  return updated;
}
