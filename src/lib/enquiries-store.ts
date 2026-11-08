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

let enquiriesRegistry: CustomEnquiry[] = [
  {
    id: 'enq-001',
    customerName: 'Rohan Shah',
    customerPhone: '9825012345',
    occasion: 'Anniversary Gift',
    neededByDate: '2026-11-20',
    budgetEstimate: '₹1,500 - ₹2,000',
    message: 'Looking for a custom bouquet with 5 purple roses and 3 white daisies in a kraft paper wrap with a custom calligraphy note.',
    status: 'QUOTED',
    adminNotes: 'Quoted ₹1,750 on WhatsApp. Sent yarn color samples.',
    createdAt: '2026-11-08T18:00:00Z',
    updatedAt: '2026-11-08T19:30:00Z',
  },
  {
    id: 'enq-002',
    customerName: 'Meera Desai',
    customerPhone: '9898098765',
    occasion: 'Birthday Favor',
    neededByDate: '2026-11-25',
    budgetEstimate: '₹2,500',
    message: 'Need 12 mini strawberry keychains as return gifts for my daughter’s birthday party.',
    status: 'NEW',
    createdAt: '2026-11-09T00:30:00Z',
    updatedAt: '2026-11-09T00:30:00Z',
  },
];

export function getEnquiries(): CustomEnquiry[] {
  return enquiriesRegistry;
}

export function saveEnquiry(enquiry: Omit<CustomEnquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>): CustomEnquiry {
  const newEnquiry: CustomEnquiry = {
    ...enquiry,
    id: `enq-${Date.now()}`,
    status: 'NEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  enquiriesRegistry.unshift(newEnquiry);
  return newEnquiry;
}

export function updateEnquiryStatus(
  id: string,
  newStatus: CustomEnquiry['status'],
  adminNotes?: string
): CustomEnquiry | null {
  const index = enquiriesRegistry.findIndex((e) => e.id === id);
  if (index === -1) return null;

  enquiriesRegistry[index] = {
    ...enquiriesRegistry[index],
    status: newStatus,
    adminNotes: adminNotes !== undefined ? adminNotes : enquiriesRegistry[index].adminNotes,
    updatedAt: new Date().toISOString(),
  };

  return enquiriesRegistry[index];
}

