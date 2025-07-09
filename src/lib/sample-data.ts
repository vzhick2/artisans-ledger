// Sample data for Artisan's Ledger prototype
// This matches the exact schema from Document 2

export interface Supplier {
  supplierId: string;
  name: string;
  storeUrl?: string;
  phone?: string;
  isArchived: boolean;
}

export interface Item {
  itemId: string;
  name: string;
  SKU: string;
  type: 'ingredient' | 'packaging' | 'product';
  isArchived: boolean;
  inventoryUnit: string;
  currentQuantity: number;
  weightedAverageCost: number;
  reorderPoint: number;
  lastCountedDate: Date;
}

export interface Recipe {
  recipeId: string;
  name: string;
  version: number;
  isArchived: boolean;
  yieldsItemId: string;
  expectedYield: number;
  laborMinutes: number;
  projectedMaterialCost: number;
}

export interface RecipeIngredient {
  recipeIngredientId: string;
  recipeId: string;
  itemId: string;
  quantity: number;
}

export interface Purchase {
  purchaseId: string;
  supplierId: string;
  purchaseDate: Date;
  grandTotal: number;
  notes?: string;
}

export interface PurchaseLineItem {
  purchaseLineItemId: string;
  purchaseId: string;
  itemId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  lotNumber?: string;
}

export interface Batch {
  batchId: string;
  recipeId: string;
  dateCreated: Date;
  qtyMade: number;
  yieldPercentage: number;
  materialCost: number;
  laborCost: number;
  actualCost: number;
  costVariance: number;
  notes?: string;
}

export interface Transaction {
  transactionId: string;
  itemId: string;
  quantityChange: number;
  newQuantity: number;
  type: 'purchase' | 'batch_usage' | 'batch_creation' | 'spot_check' | 'sale';
  sourceId: string;
  timestamp: Date;
}

export interface SpotCheck {
  spotCheckId: string;
  itemId: string;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  notes?: string;
  timestamp: Date;
}

export interface SalesMonth {
  salesMonthId: string;
  itemId: string;
  year: number;
  month: number;
  quantitySold: number;
  dataSource: 'manual' | 'imported';
}

// Sample data
export const sampleSuppliers: Supplier[] = [
  {
    supplierId: 'sup-001',
    name: 'Organic Valley Co-op',
    storeUrl: 'https://organicvalley.com',
    phone: '(555) 123-4567',
    isArchived: false
  },
  {
    supplierId: 'sup-002',
    name: 'Local Honey Farm',
    storeUrl: 'https://localhoney.com',
    phone: '(555) 987-6543',
    isArchived: false
  },
  {
    supplierId: 'sup-003',
    name: 'Artisan Packaging Co.',
    storeUrl: 'https://artisanpack.com',
    phone: '(555) 456-7890',
    isArchived: false
  }
];

export const sampleItems: Item[] = [
  {
    itemId: 'item-001',
    name: 'Organic Flour',
    SKU: 'ORG-FLOUR-001',
    type: 'ingredient',
    isArchived: false,
    inventoryUnit: 'lbs',
    currentQuantity: 25.5,
    weightedAverageCost: 2.45,
    reorderPoint: 10,
    lastCountedDate: new Date('2025-01-05')
  },
  {
    itemId: 'item-002',
    name: 'Raw Honey',
    SKU: 'HON-RAW-002',
    type: 'ingredient',
    isArchived: false,
    inventoryUnit: 'lbs',
    currentQuantity: 8.3,
    weightedAverageCost: 12.50,
    reorderPoint: 5,
    lastCountedDate: new Date('2025-01-03')
  },
  {
    itemId: 'item-003',
    name: 'Sea Salt',
    SKU: 'SALT-SEA-003',
    type: 'ingredient',
    isArchived: false,
    inventoryUnit: 'lbs',
    currentQuantity: 15.2,
    weightedAverageCost: 4.20,
    reorderPoint: 8,
    lastCountedDate: new Date('2025-01-04')
  },
  {
    itemId: 'item-004',
    name: 'Mason Jars (8oz)',
    SKU: 'JAR-8OZ-004',
    type: 'packaging',
    isArchived: false,
    inventoryUnit: 'pcs',
    currentQuantity: 144,
    weightedAverageCost: 0.85,
    reorderPoint: 50,
    lastCountedDate: new Date('2025-01-06')
  },
  {
    itemId: 'item-005',
    name: 'Honey Wheat Bread',
    SKU: 'BREAD-HW-005',
    type: 'product',
    isArchived: false,
    inventoryUnit: 'loaves',
    currentQuantity: 12,
    weightedAverageCost: 4.25,
    reorderPoint: 5,
    lastCountedDate: new Date('2025-01-07')
  },
  {
    itemId: 'item-006',
    name: 'Artisan Honey (8oz)',
    SKU: 'HON-ART-006',
    type: 'product',
    isArchived: false,
    inventoryUnit: 'jars',
    currentQuantity: 24,
    weightedAverageCost: 8.75,
    reorderPoint: 10,
    lastCountedDate: new Date('2025-01-07')
  }
];

export const sampleRecipes: Recipe[] = [
  {
    recipeId: 'rec-001',
    name: 'Honey Wheat Bread',
    version: 1,
    isArchived: false,
    yieldsItemId: 'item-005',
    expectedYield: 2,
    laborMinutes: 180,
    projectedMaterialCost: 6.50
  },
  {
    recipeId: 'rec-002',
    name: 'Artisan Honey Jar',
    version: 1,
    isArchived: false,
    yieldsItemId: 'item-006',
    expectedYield: 1,
    laborMinutes: 15,
    projectedMaterialCost: 5.25
  }
];

export const sampleRecipeIngredients: RecipeIngredient[] = [
  {
    recipeIngredientId: 'ri-001',
    recipeId: 'rec-001',
    itemId: 'item-001',
    quantity: 2
  },
  {
    recipeIngredientId: 'ri-002',
    recipeId: 'rec-001',
    itemId: 'item-002',
    quantity: 0.5
  },
  {
    recipeIngredientId: 'ri-003',
    recipeId: 'rec-001',
    itemId: 'item-003',
    quantity: 0.1
  },
  {
    recipeIngredientId: 'ri-004',
    recipeId: 'rec-002',
    itemId: 'item-002',
    quantity: 0.5
  },
  {
    recipeIngredientId: 'ri-005',
    recipeId: 'rec-002',
    itemId: 'item-004',
    quantity: 1
  }
];

export const samplePurchases: Purchase[] = [
  {
    purchaseId: 'pur-001',
    supplierId: 'sup-001',
    purchaseDate: new Date('2025-01-02'),
    grandTotal: 98.50,
    notes: 'Weekly flour and salt order'
  },
  {
    purchaseId: 'pur-002',
    supplierId: 'sup-002',
    purchaseDate: new Date('2025-01-03'),
    grandTotal: 150.00,
    notes: 'Monthly honey supply'
  },
  {
    purchaseId: 'pur-003',
    supplierId: 'sup-003',
    purchaseDate: new Date('2025-01-05'),
    grandTotal: 122.40,
    notes: 'Mason jar restock'
  }
];

export const sampleBatches: Batch[] = [
  {
    batchId: 'batch-001',
    recipeId: 'rec-001',
    dateCreated: new Date('2025-01-06'),
    qtyMade: 8,
    yieldPercentage: 100,
    materialCost: 26.00,
    laborCost: 45.00,
    actualCost: 71.00,
    costVariance: 0,
    notes: 'Perfect batch, no issues'
  },
  {
    batchId: 'batch-002',
    recipeId: 'rec-002',
    dateCreated: new Date('2025-01-07'),
    qtyMade: 12,
    yieldPercentage: 100,
    materialCost: 63.00,
    laborCost: 22.50,
    actualCost: 85.50,
    costVariance: 0,
    notes: 'Smooth production run'
  }
];

export const sampleTransactions: Transaction[] = [
  {
    transactionId: 'trans-001',
    itemId: 'item-001',
    quantityChange: 20,
    newQuantity: 20,
    type: 'purchase',
    sourceId: 'pur-001',
    timestamp: new Date('2025-01-02T10:00:00')
  },
  {
    transactionId: 'trans-002',
    itemId: 'item-002',
    quantityChange: 12,
    newQuantity: 12,
    type: 'purchase',
    sourceId: 'pur-002',
    timestamp: new Date('2025-01-03T14:00:00')
  },
  {
    transactionId: 'trans-003',
    itemId: 'item-001',
    quantityChange: -16,
    newQuantity: 4,
    type: 'batch_usage',
    sourceId: 'batch-001',
    timestamp: new Date('2025-01-06T09:00:00')
  },
  {
    transactionId: 'trans-004',
    itemId: 'item-005',
    quantityChange: 8,
    newQuantity: 8,
    type: 'batch_creation',
    sourceId: 'batch-001',
    timestamp: new Date('2025-01-06T12:00:00')
  }
];

export const sampleSalesMonths: SalesMonth[] = [
  {
    salesMonthId: 'sales-001',
    itemId: 'item-005',
    year: 2024,
    month: 12,
    quantitySold: 45,
    dataSource: 'manual'
  },
  {
    salesMonthId: 'sales-002',
    itemId: 'item-006',
    year: 2024,
    month: 12,
    quantitySold: 32,
    dataSource: 'manual'
  }
];

// Helper functions
export const getSupplierById = (id: string): Supplier | undefined => 
  sampleSuppliers.find(s => s.supplierId === id);

export const getItemById = (id: string): Item | undefined => 
  sampleItems.find(i => i.itemId === id);

export const getRecipeById = (id: string): Recipe | undefined => 
  sampleRecipes.find(r => r.recipeId === id);

export const getRecipeIngredients = (recipeId: string): RecipeIngredient[] => 
  sampleRecipeIngredients.filter(ri => ri.recipeId === recipeId);

export const getPurchaseLineItems = (purchaseId: string): PurchaseLineItem[] => 
  samplePurchaseLineItems.filter(pli => pli.purchaseId === purchaseId);

export const getItemTransactions = (itemId: string): Transaction[] => 
  sampleTransactions.filter(t => t.itemId === itemId);

// Additional sample data
export const samplePurchaseLineItems: PurchaseLineItem[] = [
  {
    purchaseLineItemId: 'pli-001',
    purchaseId: 'pur-001',
    itemId: 'item-001',
    quantity: 20,
    unitCost: 2.45,
    totalCost: 49.00,
    lotNumber: 'FL-2025-001'
  },
  {
    purchaseLineItemId: 'pli-002',
    purchaseId: 'pur-001',
    itemId: 'item-003',
    quantity: 12,
    unitCost: 4.20,
    totalCost: 49.50,
    lotNumber: 'SALT-2025-001'
  },
  {
    purchaseLineItemId: 'pli-003',
    purchaseId: 'pur-002',
    itemId: 'item-002',
    quantity: 12,
    unitCost: 12.50,
    totalCost: 150.00,
    lotNumber: 'HON-2025-001'
  },
  {
    purchaseLineItemId: 'pli-004',
    purchaseId: 'pur-003',
    itemId: 'item-004',
    quantity: 144,
    unitCost: 0.85,
    totalCost: 122.40,
    lotNumber: 'JAR-2025-001'
  }
];

export const sampleSpotChecks: SpotCheck[] = [
  {
    spotCheckId: 'spot-001',
    itemId: 'item-001',
    previousQuantity: 4.5,
    newQuantity: 4.2,
    reason: 'Found spillage during cleaning',
    notes: 'Small amount lost during weekly cleaning',
    timestamp: new Date('2025-01-05T16:00:00')
  }
];

// Dashboard metrics calculations
export const calculateDashboardMetrics = () => {
  const inventoryValue = sampleItems.reduce((total, item) => 
    total + (item.currentQuantity * item.weightedAverageCost), 0);
  
  const lowStockItems = sampleItems.filter(item => 
    item.currentQuantity <= item.reorderPoint && !item.isArchived);
  
  const outOfStockItems = sampleItems.filter(item => 
    item.currentQuantity <= 0 && !item.isArchived);
  
  const batchesThisMonth = sampleBatches.filter(batch => {
    const batchDate = new Date(batch.dateCreated);
    const now = new Date();
    return batchDate.getMonth() === now.getMonth() && 
           batchDate.getFullYear() === now.getFullYear();
  }).length;
  
  const avgYieldPercentage = sampleBatches.length > 0 ? 
    sampleBatches.reduce((sum, batch) => sum + batch.yieldPercentage, 0) / sampleBatches.length : 0;
  
  return {
    inventoryValue,
    openPurchaseOrders: 0, // No open orders in sample data
    batchesThisMonth,
    avgYieldPercentage,
    lowStockItems,
    outOfStockItems,
    inStockItems: sampleItems.filter(item => 
      item.currentQuantity > item.reorderPoint && !item.isArchived)
  };
};
