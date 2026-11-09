import { readJsonFile, writeJsonFile } from './json-db';
import { createAdminClient } from './supabase/admin';
import { isSupabaseConfigured } from './supabase/status';

export interface DeliveryZone {
  pin: string;
  area: string;
  fee: number;
  active: boolean;
}

const ZONES_FILE = 'delivery-zones.json';

export const SEED_ZONES: DeliveryZone[] = [
  { pin: '390001', area: 'Alkapuri / Central Vadodara', fee: 50, active: true },
  { pin: '390002', area: 'Mandvi / Old City', fee: 50, active: true },
  { pin: '390004', area: 'Fatehgunj / MS University Area', fee: 50, active: true },
  { pin: '390007', area: 'Race Course / Inox Area', fee: 50, active: true },
  { pin: '390008', area: 'Waghodia Road', fee: 50, active: true },
  { pin: '390010', area: 'Karelibaug', fee: 50, active: true },
  { pin: '390011', area: 'Sayajigunj / Station Area', fee: 50, active: true },
  { pin: '390012', area: 'Gorwa / BIDC', fee: 50, active: true },
  { pin: '390015', area: 'Sama / New Sama Road', fee: 50, active: true },
  { pin: '390018', area: 'Gotri', fee: 50, active: true },
  { pin: '390019', area: 'Harni / Airport Area', fee: 50, active: true },
  { pin: '390020', area: 'Manjalpur / Makarpura', fee: 50, active: true },
  { pin: '390021', area: 'Gotri Road / Sevasi', fee: 50, active: true },
  { pin: '390022', area: 'Vasna / Bhayli Road', fee: 50, active: true },
  { pin: '390023', area: 'Subhanpura', fee: 50, active: true },
  { pin: '390024', area: 'Akota', fee: 50, active: true },
  { pin: '390025', area: 'Tarsali', fee: 50, active: true },
];

export function getDeliveryZones(): DeliveryZone[] {
  return readJsonFile<DeliveryZone[]>(ZONES_FILE, SEED_ZONES);
}

export function saveDeliveryZone(zone: DeliveryZone): DeliveryZone {
  const zones = getDeliveryZones();
  const index = zones.findIndex((z) => z.pin === zone.pin);
  if (index > -1) {
    zones[index] = zone;
  } else {
    zones.push(zone);
  }
  writeJsonFile(ZONES_FILE, zones);
  return zone;
}

export function toggleDeliveryZone(pin: string): DeliveryZone | null {
  const zones = getDeliveryZones();
  const index = zones.findIndex((z) => z.pin === pin);
  if (index === -1) return null;
  zones[index].active = !zones[index].active;
  writeJsonFile(ZONES_FILE, zones);
  return zones[index];
}

export function deleteDeliveryZone(pin: string): boolean {
  const zones = getDeliveryZones();
  const filtered = zones.filter((z) => z.pin !== pin);
  if (filtered.length < zones.length) {
    writeJsonFile(ZONES_FILE, filtered);
    return true;
  }
  return false;
}

export async function getDeliveryZonesAsync(): Promise<DeliveryZone[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .order('postal_code', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          pin: d.postal_code,
          area: d.zone_name,
          fee: Number(d.delivery_fee),
          active: Boolean(d.is_active),
        }));
      }
    } catch {
      // Fall back to JSON
    }
  }
  return getDeliveryZones();
}

export async function saveDeliveryZoneAsync(zone: DeliveryZone): Promise<DeliveryZone> {
  const saved = saveDeliveryZone(zone);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase.from('delivery_zones').upsert(
        {
          postal_code: zone.pin,
          zone_name: zone.area,
          delivery_fee: zone.fee,
          is_active: zone.active,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'postal_code' }
      );
    } catch {
      // JSON already saved
    }
  }
  return saved;
}

export async function toggleDeliveryZoneAsync(pin: string): Promise<DeliveryZone | null> {
  const toggled = toggleDeliveryZone(pin);
  if (isSupabaseConfigured() && toggled) {
    try {
      const supabase = createAdminClient();
      await supabase
        .from('delivery_zones')
        .update({ is_active: toggled.active, updated_at: new Date().toISOString() })
        .eq('postal_code', pin);
    } catch {
      // JSON already toggled
    }
  }
  return toggled;
}

export async function deleteDeliveryZoneAsync(pin: string): Promise<boolean> {
  const deleted = deleteDeliveryZone(pin);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      await supabase.from('delivery_zones').delete().eq('postal_code', pin);
    } catch {
      // JSON already deleted
    }
  }
  return deleted;
}

export function isPinServiceable(pin: string): { serviceable: boolean; zone?: DeliveryZone } {
  const zones = getDeliveryZones();
  const clean = pin.trim();
  const found = zones.find((z) => z.pin === clean && z.active);
  if (found) return { serviceable: true, zone: found };
  if (clean.startsWith('390')) {
    return {
      serviceable: true,
      zone: { pin: clean, area: 'Vadodara Area', fee: 50, active: true },
    };
  }
  return { serviceable: false };
}

