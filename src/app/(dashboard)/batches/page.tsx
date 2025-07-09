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
import { 
  sampleBatches, 
  getRecipeById, 
  getItemById 
} from '@/lib/sample-data';
import { 
  FlaskConical, 
  Plus, 
  ChefHat, 
  Package, 
  DollarSign,
  TrendingUp,
  Calendar
} from 'lucide-react';

export default function Batches() {
  const [showNewBatch, setShowNewBatch] = useState(false);
  
  const getYieldBadge = (yieldPercentage: number) => {
    if (yieldPercentage >= 100) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Perfect</Badge>;
    } else if (yieldPercentage >= 90) {
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Good</Badge>;
    } else {
      return <Badge variant="destructive">Below Target</Badge>;
    }
  };

  const calculateTotalCost = (batch: any) => {
    return batch.materialCost + batch.laborCost;
  };

  const calculateCostPerUnit = (batch: any) => {
    const totalCost = calculateTotalCost(batch);
    return batch.qtyMade > 0 ? totalCost / batch.qtyMade : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Batches</h1>
        <Button onClick={() => setShowNewBatch(!showNewBatch)}>
          <Plus className="h-4 w-4 mr-2" />
          {showNewBatch ? 'Cancel' : 'Log Batch'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleBatches.length}</div>
            <p className="text-xs text-muted-foreground">Production runs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Yield</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sampleBatches.length > 0 
                ? (sampleBatches.reduce((sum, b) => sum + b.yieldPercentage, 0) / sampleBatches.length).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Production efficiency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Production</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sampleBatches.reduce((sum, b) => sum + b.qtyMade, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Units produced</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${sampleBatches.reduce((sum, b) => sum + calculateTotalCost(b), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Material + Labor</p>
          </CardContent>
        </Card>
      </div>

      {/* Batches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Production History</CardTitle>
          <CardDescription>
            All production batches with costs and yield information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Recipe</TableHead>
                <TableHead>Quantity Made</TableHead>
                <TableHead>Yield %</TableHead>
                <TableHead>Material Cost</TableHead>
                <TableHead>Labor Cost</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Cost per Unit</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleBatches.map((batch) => {
                const recipe = getRecipeById(batch.recipeId);
                const product = recipe ? getItemById(recipe.yieldsItemId) : null;
                const totalCost = calculateTotalCost(batch);
                const costPerUnit = calculateCostPerUnit(batch);
                
                return (
                  <TableRow key={batch.batchId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {batch.dateCreated.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ChefHat className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-medium">{recipe?.name || 'Unknown Recipe'}</div>
                          <div className="text-sm text-muted-foreground">
                            v{recipe?.version} → {product?.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{batch.qtyMade}</span>
                        <span className="text-sm text-muted-foreground">
                          {product?.inventoryUnit || 'units'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{batch.yieldPercentage}%</span>
                        {getYieldBadge(batch.yieldPercentage)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span>{batch.materialCost.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span>{batch.laborCost.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-green-600 dark:text-green-400" />
                        <span className="font-medium">{totalCost.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        ${costPerUnit.toFixed(2)} per {product?.inventoryUnit || 'unit'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-32 truncate">
                        {batch.notes || 'No notes'}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {sampleBatches.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No production batches recorded yet. Log your first batch to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
