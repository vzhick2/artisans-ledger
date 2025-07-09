'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormErrorBoundary } from '@/components/error-boundary';
import { ArrowLeft, Package, Save, Loader2, AlertCircle } from 'lucide-react';
import { itemSchema, type ItemFormData } from '@/lib/validations';
import { useToast } from '@/hooks/use-toast';
import { useFormHotkeys } from '@/hooks/use-hotkeys';

export default function NewItem() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      sku: '',
      type: 'ingredient',
      inventoryUnit: 'lbs',
      reorderPoint: 0,
      initialQuantity: 0,
      unitCost: 0,
    },
  });

  const onSubmit = async (data: ItemFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement actual item creation API call
      console.log('Creating item:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success!",
        description: `Item "${data.name}" has been created successfully.`,
        variant: "success",
      });

      router.push('/items');
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Error",
        description: "Failed to create item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add form hotkeys
  useFormHotkeys(
    () => handleSubmit(onSubmit)(),
    () => reset()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Add New Item</h1>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Item Information</CardTitle>
          <CardDescription>
            Enter the details for the new inventory item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormErrorBoundary>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., Organic Flour"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.name.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  {...register('sku')}
                  placeholder="e.g., FLR-ORG-001"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.sku}
                />
                {errors.sku && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.sku.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            {/* Type and Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={watch('type')}
                  onValueChange={(value) => setValue('type', value as 'ingredient' | 'packaging' | 'product')}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="type" aria-invalid={!!errors.type}>
                    <SelectValue placeholder="Select item type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingredient">Ingredient</SelectItem>
                    <SelectItem value="packaging">Packaging</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.type.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inventoryUnit">Inventory Unit *</Label>
                <Select
                  value={watch('inventoryUnit')}
                  onValueChange={(value) => setValue('inventoryUnit', value as 'lbs' | 'oz' | 'kg' | 'g' | 'each' | 'gallon' | 'liter' | 'cup')}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="inventoryUnit" aria-invalid={!!errors.inventoryUnit}>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                    <SelectItem value="oz">Ounces (oz)</SelectItem>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="g">Grams (g)</SelectItem>
                    <SelectItem value="each">Each</SelectItem>
                    <SelectItem value="gallon">Gallon</SelectItem>
                    <SelectItem value="liter">Liter</SelectItem>
                    <SelectItem value="cup">Cup</SelectItem>
                  </SelectContent>
                </Select>
                {errors.inventoryUnit && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.inventoryUnit.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            {/* Inventory Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reorderPoint">Reorder Point</Label>
                <Input
                  id="reorderPoint"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('reorderPoint', { valueAsNumber: true })}
                  placeholder="100"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.reorderPoint}
                />
                {errors.reorderPoint && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.reorderPoint.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialQuantity">Initial Quantity</Label>
                <Input
                  id="initialQuantity"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('initialQuantity', { valueAsNumber: true })}
                  placeholder="0"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.initialQuantity}
                />
                {errors.initialQuantity && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.initialQuantity.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitCost">Unit Cost ($)</Label>
                <Input
                  id="unitCost"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('unitCost', { valueAsNumber: true })}
                  placeholder="0.00"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.unitCost}
                />
                {errors.unitCost && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.unitCost.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Item
                  </>
                )}
              </Button>
            </div>
          </form>
          </FormErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
}
