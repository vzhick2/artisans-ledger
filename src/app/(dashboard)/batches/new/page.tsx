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
import { sampleRecipes } from '@/lib/sample-data';
import { ArrowLeft, FlaskConical, Save, Loader2, AlertCircle } from 'lucide-react';
import { batchSchema, type BatchFormData } from '@/lib/validations';
import { useToast } from '@/hooks/use-toast';
import { FormErrorBoundary } from '@/components/error-boundary';

export default function NewBatch() {
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
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      recipeId: '',
      quantityMade: 0,
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const selectedRecipeId = watch('recipeId');
  const selectedRecipe = sampleRecipes.find(r => r.recipeId === selectedRecipeId);

  const onSubmit = async (data: BatchFormData) => {
    setIsSubmitting(true);
    try {
      // NOTE: Using mock data - API integration planned for Phase 2
      console.log('Creating batch:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success!",
        description: "Batch has been logged successfully.",
      });

      // Reset form and redirect
      reset();
      router.push('/batches');
    } catch (error) {
      console.error('Error creating batch:', error);
      toast({
        title: "Error",
        description: "Failed to log batch. Please try again.",
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Log New Batch</h1>
          <p className="text-gray-600 dark:text-gray-400">Record a new production batch</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            Batch Details
          </CardTitle>
          <CardDescription>
            Enter the details of your production batch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormErrorBoundary>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipeId">
                  Recipe <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue('recipeId', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className={errors.recipeId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select recipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleRecipes.map((recipe) => (
                      <SelectItem key={recipe.recipeId} value={recipe.recipeId}>
                        {recipe.name} (v{recipe.version})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.recipeId && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.recipeId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantityMade">
                  Quantity Made <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantityMade"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0"
                  {...register('quantityMade', { valueAsNumber: true })}
                  className={errors.quantityMade ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.quantityMade && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.quantityMade.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">
                  Production Date <span className="text-red-500">*</span>
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

            {/* Recipe Information Display */}
            {selectedRecipe && (
              <Alert>
                <FlaskConical className="w-4 h-4" />
                <AlertDescription>
                  <strong>{selectedRecipe.name}</strong> - Expected yield: {selectedRecipe.expectedYield} units
                  <br />
                  Estimated material cost: ${selectedRecipe.projectedMaterialCost.toFixed(2)}
                  <br />
                  Labor time: {selectedRecipe.laborMinutes} minutes
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Optional notes about this batch..."
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
                    Log Batch
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
