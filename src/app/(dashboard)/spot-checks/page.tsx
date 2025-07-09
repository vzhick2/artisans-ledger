'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { sampleSpotChecks, getItemById } from '@/lib/sample-data';
import { 
  Search, 
  Plus, 
  Package, 
  Calendar,
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function SpotChecks() {
  const [showNewSpotCheck, setShowNewSpotCheck] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Spot Checks</h1>
        <Button onClick={() => setShowNewSpotCheck(!showNewSpotCheck)}>
          <Plus className="h-4 w-4 mr-2" />
          {showNewSpotCheck ? 'Cancel' : 'New Spot Check'}
        </Button>
      </div>

      {/* Spot Check History */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Corrections</CardTitle>
          <CardDescription>
            Manual inventory adjustments and physical count corrections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Previous Qty</TableHead>
                <TableHead>New Qty</TableHead>
                <TableHead>Variance</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleSpotChecks.map((check) => {
                const item = getItemById(check.itemId);
                const variance = check.newQuantity - check.previousQuantity;
                
                return (
                  <TableRow key={check.spotCheckId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {check.timestamp.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{item?.name || 'Unknown Item'}</div>
                          <div className="text-sm text-muted-foreground">{item?.SKU}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{check.previousQuantity} {item?.inventoryUnit}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{check.newQuantity} {item?.inventoryUnit}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {variance !== 0 && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        )}
                        <span className={`font-medium ${variance > 0 ? 'text-green-600' : variance < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {variance > 0 ? '+' : ''}{variance} {item?.inventoryUnit}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {check.reason}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-32 truncate">
                        {check.notes || 'No notes'}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {sampleSpotChecks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No spot checks recorded yet. Perform your first inventory correction.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
