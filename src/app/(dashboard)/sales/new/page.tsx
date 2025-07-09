'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, TrendingUp, Save, Loader2, AlertCircle } from 'lucide-react';
import { salesSchema, type SalesFormData } from '@/lib/validations';
import { sampleItems } from '@/lib/sample-data';
import { useToast } from '@/hooks/use-toast';
import { FormErrorBoundary } from '@/components/error-boundary';

export default function NewSale() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter items to only show products
  const products = sampleItems.filter(item => item.type === 'product');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SalesFormData>({
    resolver: zodResolver(salesSchema),
    defaultValues: {
      productId: '',
      quantity: 0,
      unitPrice: 0,
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const selectedProductId = watch('productId');
  const quantity = watch('quantity');
  const unitPrice = watch('unitPrice');
  const selectedProduct = sampleItems.find(item => item.itemId === selectedProductId);
  const totalAmount = quantity * unitPrice;

  const onSubmit = async (data: SalesFormData) => {
    setIsSubmitting(true);
    try {
      // NOTE: Using mock data - API integration planned for Phase 2
      console.log('Creating sales entry:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success!",
        description: "Sales entry has been recorded successfully.",
      });

      // Reset form and redirect
      reset();
      router.push('/sales');
    } catch (error) {
      console.error('Error creating sales entry:', error);
      toast({
        title: "Error",
        description: "Failed to record sales entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Log New Sale</h1>
          <p className="text-gray-600 dark:text-gray-400">Record a new sales entry</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Sales Entry Details
          </CardTitle>
          <CardDescription>
            Enter the details of the sale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormErrorBoundary>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Product and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productId">
                  Product <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue('productId', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className={errors.productId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.itemId} value={product.itemId}>
                        {product.name} ({product.inventoryUnit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.productId && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.productId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">
                  Sale Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                  className={errors.date ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.date && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.date.message}
                  </p>
                )}
              </div>
            </div>

            {/* Current Inventory Display */}
            {selectedProduct && (
              <Alert>
                <TrendingUp className="w-4 h-4" />
                <AlertDescription>
                  <strong>Current Inventory:</strong> {selectedProduct.currentQuantity} {selectedProduct.inventoryUnit}
                  <br />
                  <strong>Weighted Average Cost:</strong> ${selectedProduct.weightedAverageCost.toFixed(2)} per {selectedProduct.inventoryUnit}
                </AlertDescription>
              </Alert>
            )}

            {/* Quantity and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity Sold <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0"
                  {...register('quantity', { valueAsNumber: true })}
                  className={errors.quantity ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">
                  Unit Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register('unitPrice', { valueAsNumber: true })}
                  className={errors.unitPrice ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.unitPrice && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.unitPrice.message}
                  </p>
                )}
              </div>
            </div>

            {/* Total Amount Display */}
            {totalAmount > 0 && (
              <Alert>
                <TrendingUp className="w-4 h-4" />
                <AlertDescription>
                  <strong>Total Sale Amount: ${totalAmount.toFixed(2)}</strong>
                  {selectedProduct && (
                    <>
                      <br />
                      <strong>Estimated Profit: ${(totalAmount - (quantity * selectedProduct.weightedAverageCost)).toFixed(2)}</strong>
                    </>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this sale..."
                {...register('notes')}
                className={errors.notes ? 'border-red-500' : ''}
                disabled={isSubmitting}
                rows={3}
              />
              {errors.notes && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.notes.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Recording...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Record Sale
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
