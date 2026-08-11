export const sampleOrders = [
  {
    id: 'MC240981',
    date: '02 Aug 2026',
    status: 'Delivered',
    total: 486,
    items: [
      { name: 'Dolo 650 Tablet', qty: 2, price: 27 },
      { name: 'Shelcal 500 Tablet', qty: 3, price: 118 },
    ],
    currentStep: 6,
  },
  {
    id: 'MC240822',
    date: '28 Jul 2026',
    status: 'Out for Delivery',
    total: 339,
    items: [{ name: 'Cetaphil Gentle Skin Cleanser', qty: 1, price: 339 }],
    currentStep: 5,
  },
  {
    id: 'MC240711',
    date: '15 Jul 2026',
    status: 'Delivered',
    total: 1899,
    items: [{ name: 'Omron Digital BP Monitor', qty: 1, price: 1899 }],
    currentStep: 6,
  },
]

export const orderTimelineSteps = [
  'Order Placed',
  'Order Confirmed',
  'Prescription Verified',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
]
