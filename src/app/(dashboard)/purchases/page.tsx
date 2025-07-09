'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  samplePurchases, 
  samplePurchaseLineItems, 
  sampleSuppliers, 
  sampleItems,
  getSupplierById, 
  getItemById,
  getPurchaseLineItems 
} from '@/lib/sample-data';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Calculator,
  Package,
  DollarSign
} from 'lucide-react';

interface PurchaseLineItem {
  id: string;
  itemId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  lotNumber: string;
  notes: string;
}

export default function Purchases() {
  const [showNewPurchase, setShowNewPurchase] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [purchaseNotes, setPurchaseNotes] = useState('');
  const [lineItems, setLineItems] = useState<PurchaseLineItem[]>([
    {
      id: '1',
      itemId: '',
      quantity: 0,
      unitCost: 0,
      totalCost: 0,
      lotNumber: '',
      notes: ''
    }
  ]);

  const addLineItem = () => {
    const newItem: PurchaseLineItem = {
      id: Date.now().toString(),
      itemId: '',
      quantity: 0,
      unitCost: 0,
      totalCost: 0,
      lotNumber: '',
      notes: ''
    };
    setLineItems([...lineItems, newItem]);
  };

  const updateLineItem = (id: string, field: keyof PurchaseLineItem, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitCost') {
          updatedItem.totalCost = updatedItem.quantity * updatedItem.unitCost;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const calculateGrandTotal = () => {
    return lineItems.reduce((total, item) => total + item.totalCost, 0);
  };

  const getCostPerBaseUnit = (itemId: string, unitCost: number) => {
    const item = getItemById(itemId);
    if (!item || !unitCost) return '';
    return `$${unitCost.toFixed(4)} per ${item.inventoryUnit}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Purchases</h1>
        <Button onClick={() => setShowNewPurchase(!showNewPurchase)}>
          <Plus className="h-4 w-4 mr-2" />
          {showNewPurchase ? 'Cancel' : 'Log Purchase'}
        </Button>
      </div>

      {/* New Purchase Form */}
      {showNewPurchase && (
        <Card>
          <CardHeader>
            <CardTitle>Log New Purchase</CardTitle>
            <CardDescription>
              Enter the details of your purchase using the spreadsheet-style interface below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Purchase Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleSuppliers.map((supplier) => (
                      <SelectItem key={supplier.supplierId} value={supplier.supplierId}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Purchase Notes</Label>
                <Input
                  id="notes"
                  placeholder="Optional notes about this purchase"
                  value={purchaseNotes}
                  onChange={(e) => setPurchaseNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Purchase Items</Label>
                <Button variant="outline" size="sm" onClick={addLineItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Lot #</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="w-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((lineItem) => {
                      const selectedItem = getItemById(lineItem.itemId);
                      return (
                        <TableRow key={lineItem.id}>
                          <TableCell>
                            <Select 
                              value={lineItem.itemId} 
                              onValueChange={(value) => updateLineItem(lineItem.id, 'itemId', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select item" />
                              </SelectTrigger>
                              <SelectContent>
                                {sampleItems.map((item) => (
                                  <SelectItem key={item.itemId} value={item.itemId}>
                                    {item.name} ({item.SKU})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Input
                                type="number"
                                placeholder="0"
                                value={lineItem.quantity || ''}
                                onChange={(e) => updateLineItem(lineItem.id, 'quantity', parseFloat(e.target.value) || 0)}
                                className="w-24"
                              />
                              {selectedItem && (
                                <div className="text-xs text-muted-foreground">
                                  {selectedItem.inventoryUnit}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={lineItem.unitCost || ''}
                                onChange={(e) => updateLineItem(lineItem.id, 'unitCost', parseFloat(e.target.value) || 0)}
                                className="w-24"
                              />
                              {selectedItem && lineItem.unitCost > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  {getCostPerBaseUnit(lineItem.itemId, lineItem.unitCost)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              ${lineItem.totalCost.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="LOT-001"
                              value={lineItem.lotNumber}
                              onChange={(e) => updateLineItem(lineItem.id, 'lotNumber', e.target.value)}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Notes"
                              value={lineItem.notes}
                              onChange={(e) => updateLineItem(lineItem.id, 'notes', e.target.value)}
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLineItem(lineItem.id)}
                              disabled={lineItems.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-end">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium">Grand Total:</span>
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    ${calculateGrandTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewPurchase(false)}>
                Cancel
              </Button>
              <Button disabled={!selectedSupplier || lineItems.length === 0}>
                Save Purchase
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Purchase History */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
          <CardDescription>
            All previous purchases and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Grand Total</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {samplePurchases.map((purchase) => {
                const supplier = getSupplierById(purchase.supplierId);
                const lineItems = getPurchaseLineItems(purchase.purchaseId);
                
                return (
                  <TableRow key={purchase.purchaseId}>
                    <TableCell>
                      {purchase.purchaseDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{supplier?.name || 'Unknown'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {lineItems.map((lineItem) => {
                          const item = getItemById(lineItem.itemId);
                          return (
                            <div key={lineItem.purchaseLineItemId} className="text-sm">
                              {item?.name} ({lineItem.quantity} {item?.inventoryUnit})
                            </div>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">${purchase.grandTotal.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {purchase.notes || 'No notes'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {samplePurchases.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No purchases recorded yet. Log your first purchase to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
