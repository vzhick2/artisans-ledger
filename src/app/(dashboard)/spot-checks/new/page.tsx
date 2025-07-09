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
import { ArrowLeft, Search, Save, Loader2, AlertCircle } from 'lucide-react';
import { spotCheckSchema, type SpotCheckFormData } from '@/lib/validations';
import { sampleItems } from '@/lib/sample-data';
import { useToast } from '@/hooks/use-toast';
import { FormErrorBoundary } from '@/components/error-boundary';

export default function NewSpotCheck() {
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
  } = useForm<SpotCheckFormData>({
    resolver: zodResolver(spotCheckSchema),
    defaultValues: {
      itemId: '',
      countedQuantity: 0,
      notes: '',
    },
  });

  const selectedItemId = watch('itemId');
  const selectedItem = sampleItems.find(item => item.itemId === selectedItemId);

  const onSubmit = async (data: SpotCheckFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement actual spot check creation API call
      console.log('Creating spot check:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success!",
        description: "Spot check has been recorded successfully.",
      });

      // Reset form and redirect
      reset();
      router.push('/spot-checks');
    } catch (error) {
      console.error('Error creating spot check:', error);
      toast({
        title: "Error",
        description: "Failed to record spot check. Please try again.",
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">New Spot Check</h1>
          <p className="text-gray-600 dark:text-gray-400">Perform an inventory spot check</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Spot Check Details
          </CardTitle>
          <CardDescription>
            Count a specific item and record any discrepancies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormErrorBoundary>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Item Selection */}
            <div className="space-y-2">
              <Label htmlFor="itemId">
                Item to Count <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue('itemId', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.itemId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select item to count" />
                </SelectTrigger>
                <SelectContent>
                  {sampleItems.map((item) => (
                    <SelectItem key={item.itemId} value={item.itemId}>
                      {item.name} ({item.inventoryUnit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.itemId && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.itemId.message}
                </p>
              )}
            </div>

            {/* Current Inventory Display */}
            {selectedItem && (
              <Alert>
                <Search className="w-4 h-4" />
                <AlertDescription>
                  <strong>Current System Quantity:</strong> {selectedItem.currentQuantity} {selectedItem.inventoryUnit}
                  <br />
                  <strong>Reorder Point:</strong> {selectedItem.reorderPoint} {selectedItem.inventoryUnit}
                  <br />
                  <strong>Last Counted:</strong> {selectedItem.lastCountedDate.toLocaleDateString()}
                </AlertDescription>
              </Alert>
            )}

            {/* Counted Quantity */}
            <div className="space-y-2">
              <Label htmlFor="countedQuantity">
                Counted Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="countedQuantity"
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                {...register('countedQuantity', { valueAsNumber: true })}
                className={errors.countedQuantity ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.countedQuantity && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.countedQuantity.message}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any notes about this spot check (discrepancies, conditions, etc.)..."
                {...register('notes')}
                className={errors.notes ? 'border-red-500' : ''}
                disabled={isSubmitting}
                rows={4}
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
                    Record Spot Check
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
