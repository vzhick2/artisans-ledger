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
  sampleRecipes, 
  sampleRecipeIngredients, 
  getItemById, 
  getRecipeIngredients 
} from '@/lib/sample-data';
import { 
  ChefHat, 
  Plus, 
  Edit, 
  Archive, 
  Copy, 
  Clock, 
  DollarSign,
  Package,
  AlertTriangle
} from 'lucide-react';

export default function Recipes() {
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);
  const [showNewRecipe, setShowNewRecipe] = useState(false);

  const calculateBatchesPossible = (recipeId: string) => {
    const ingredients = getRecipeIngredients(recipeId);
    let minBatches = Infinity;
    let limitingFactor = '';

    ingredients.forEach(ingredient => {
      const item = getItemById(ingredient.itemId);
      if (item) {
        const possibleBatches = Math.floor(item.currentQuantity / ingredient.quantity);
        if (possibleBatches < minBatches) {
          minBatches = possibleBatches;
          limitingFactor = item.name;
        }
      }
    });

    return {
      batches: minBatches === Infinity ? 0 : minBatches,
      limitingFactor
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recipes</h1>
        <Button onClick={() => setShowNewRecipe(!showNewRecipe)}>
          <Plus className="h-4 w-4 mr-2" />
          {showNewRecipe ? 'Cancel' : 'Add Recipe'}
        </Button>
      </div>

      {/* Recipes List */}
      <Card>
        <CardHeader>
          <CardTitle>Production Recipes</CardTitle>
          <CardDescription>
            Manage your product recipes and view production capacity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleRecipes.map((recipe) => {
              const batchCapacity = calculateBatchesPossible(recipe.recipeId);
              const isExpanded = expandedRecipe === recipe.recipeId;
              const yieldsItem = getItemById(recipe.yieldsItemId);

              return (
                <div key={recipe.recipeId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ChefHat className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-semibold text-lg">{recipe.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Version {recipe.version}</span>
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            <span>Yields: {recipe.expectedYield} {yieldsItem?.inventoryUnit}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{recipe.laborMinutes} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>${recipe.projectedMaterialCost.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Batches Possible</div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">
                            {batchCapacity.batches}
                          </span>
                          {batchCapacity.batches === 0 && (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          )}
                        </div>
                        {batchCapacity.limitingFactor && (
                          <div className="text-xs text-muted-foreground">
                            Limited by: {batchCapacity.limitingFactor}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedRecipe(isExpanded ? null : recipe.recipeId)}
                        >
                          {isExpanded ? 'Hide' : 'View'} Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={batchCapacity.batches === 0}
                        >
                          Log Batch
                        </Button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Ingredients */}
                        <div>
                          <h4 className="font-medium mb-3">Ingredients</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Ingredient</TableHead>
                                <TableHead>Required</TableHead>
                                <TableHead>Available</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getRecipeIngredients(recipe.recipeId).map((ingredient) => {
                                const item = getItemById(ingredient.itemId);
                                const isAvailable = item && item.currentQuantity >= ingredient.quantity;
                                
                                return (
                                  <TableRow key={ingredient.recipeIngredientId}>
                                    <TableCell className="font-medium">
                                      {item?.name || 'Unknown Item'}
                                    </TableCell>
                                    <TableCell>
                                      {ingredient.quantity} {item?.inventoryUnit}
                                    </TableCell>
                                    <TableCell>
                                      {item?.currentQuantity || 0} {item?.inventoryUnit}
                                    </TableCell>
                                    <TableCell>
                                      {isAvailable ? (
                                        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                          Available
                                        </Badge>
                                      ) : (
                                        <Badge variant="destructive">
                                          Insufficient
                                        </Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Recipe Actions */}
                        <div>
                          <h4 className="font-medium mb-3">Actions</h4>
                          <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Recipe
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Recipe
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <Archive className="h-4 w-4 mr-2" />
                              Archive Recipe
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {sampleRecipes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ChefHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recipes found. Create your first recipe to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
