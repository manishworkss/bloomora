import { readJsonFile, writeJsonFile } from './json-db';

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

