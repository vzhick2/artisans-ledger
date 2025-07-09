'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ShoppingCart, Save, Loader2, AlertCircle, Plus, Minus } from 'lucide-react';
import { purchaseSchema, type PurchaseFormData } from '@/lib/validations';
import { sampleSuppliers, sampleItems } from '@/lib/sample-data';
import { useToast } from '@/hooks/use-toast';
import { FormErrorBoundary } from '@/components/error-boundary';

export default function NewPurchase() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter items to only show ingredients and packaging
  const purchasableItems = sampleItems.filter(item => item.type === 'ingredient' || item.type === 'packaging');

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplierId: '',
      notes: '',
      lineItems: [{ itemId: '', quantity: 0, unitCost: 0, lotNumber: '', notes: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  });

  const lineItems = watch('lineItems');
  const totalCost = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitCost || 0), 0);

  const onSubmit = async (data: PurchaseFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement actual purchase creation API call
      console.log('Creating purchase:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success!",
        description: "Purchase has been logged successfully.",
      });

      // Reset form and redirect
      reset();
      router.push('/purchases');
    } catch (error) {
      console.error('Error creating purchase:', error);
      toast({
        title: "Error",
        description: "Failed to log purchase. Please try again.",
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Log New Purchase</h1>
          <p className="text-gray-600 dark:text-gray-400">Record a new purchase order</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Purchase Details
          </CardTitle>
          <CardDescription>
            Enter the purchase information and line items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormErrorBoundary>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Supplier Selection */}
            <div className="space-y-2">
              <Label htmlFor="supplierId">
                Supplier <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue('supplierId', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.supplierId ? 'border-red-500' : ''}>
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
              {errors.supplierId && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.supplierId.message}
                </p>
              )}
            </div>

            {/* Line Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>
                  Items <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ itemId: '', quantity: 0, unitCost: 0, lotNumber: '', notes: '' })}
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 border rounded-lg">
                  <div className="lg:col-span-3 space-y-2">
                    <Label htmlFor={`lineItems.${index}.itemId`}>Item</Label>
                    <Select
                      onValueChange={(value) => setValue(`lineItems.${index}.itemId`, value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={errors.lineItems?.[index]?.itemId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {purchasableItems.map((item) => (
                          <SelectItem key={item.itemId} value={item.itemId}>
                            {item.name} ({item.inventoryUnit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.lineItems?.[index]?.itemId && (
                      <p className="text-sm text-red-500">{errors.lineItems[index]?.itemId?.message}</p>
                    )}
                  </div>

                  <div className="lg:col-span-2 space-y-2">
                    <Label htmlFor={`lineItems.${index}.quantity`}>Quantity</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0"
                      {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
                      className={errors.lineItems?.[index]?.quantity ? 'border-red-500' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.lineItems?.[index]?.quantity && (
                      <p className="text-sm text-red-500">{errors.lineItems[index]?.quantity?.message}</p>
                    )}
                  </div>

                  <div className="lg:col-span-2 space-y-2">
                    <Label htmlFor={`lineItems.${index}.unitCost`}>Unit Cost</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...register(`lineItems.${index}.unitCost`, { valueAsNumber: true })}
                      className={errors.lineItems?.[index]?.unitCost ? 'border-red-500' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.lineItems?.[index]?.unitCost && (
                      <p className="text-sm text-red-500">{errors.lineItems[index]?.unitCost?.message}</p>
                    )}
                  </div>

                  <div className="lg:col-span-2 space-y-2">
                    <Label htmlFor={`lineItems.${index}.lotNumber`}>Lot Number</Label>
                    <Input
                      placeholder="Optional"
                      {...register(`lineItems.${index}.lotNumber`)}
                      className={errors.lineItems?.[index]?.lotNumber ? 'border-red-500' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.lineItems?.[index]?.lotNumber && (
                      <p className="text-sm text-red-500">{errors.lineItems[index]?.lotNumber?.message}</p>
                    )}
                  </div>

                  <div className="lg:col-span-2 space-y-2">
                    <Label htmlFor={`lineItems.${index}.notes`}>Notes</Label>
                    <Input
                      placeholder="Optional"
                      {...register(`lineItems.${index}.notes`)}
                      className={errors.lineItems?.[index]?.notes ? 'border-red-500' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.lineItems?.[index]?.notes && (
                      <p className="text-sm text-red-500">{errors.lineItems[index]?.notes?.message}</p>
                    )}
                  </div>

                  <div className="lg:col-span-1 flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={isSubmitting || fields.length === 1}
                      className="w-full"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {errors.lineItems && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.lineItems.message}
                </p>
              )}
            </div>

            {/* Total Cost Display */}
            {totalCost > 0 && (
              <Alert>
                <ShoppingCart className="w-4 h-4" />
                <AlertDescription>
                  <strong>Total Purchase Cost: ${totalCost.toFixed(2)}</strong>
                </AlertDescription>
              </Alert>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Purchase Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this purchase..."
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
                    Logging...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Log Purchase
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
