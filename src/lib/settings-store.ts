import { readJsonFile, writeJsonFile } from './json-db';

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
  instagramHandle: 'the_.handmadecraft',
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
