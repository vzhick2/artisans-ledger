'use client';

import { FormErrorBoundary } from '@/components/error-boundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sampleItems } from '@/lib/sample-data';
import { recipeSchema, type RecipeFormData } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, ChefHat, Loader2, Minus, Plus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

const inventoryUnits = ["lbs", "oz", "kg", "g", "each", "gallon", "liter", "cup"];

export default function NewRecipe() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter items to only show ingredients
  const ingredients = sampleItems.filter(item => item.type === 'ingredient');

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: '',
      description: '',
      yieldQuantity: 1,
      yieldUnit: 'each',
      prepTime: 0,
      cookTime: 0,
      instructions: '',
      ingredients: [{ itemId: '', quantity: 0, notes: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const onSubmit = async (data: RecipeFormData) => {
    setIsSubmitting(true);
    try {
      // NOTE: Using mock data - API integration planned for Phase 2
      console.log('Creating recipe:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success!",
        description: "Recipe has been created successfully.",
      });

      // Reset form and redirect
      reset();
      router.push('/recipes');
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast({
        title: "Error",
        description: "Failed to create recipe. Please try again.",
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Add New Recipe</h1>
          <p className="text-gray-600 dark:text-gray-400">Create a new production recipe</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            Recipe Details
          </CardTitle>
          <CardDescription>
            Enter the recipe information and ingredients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormErrorBoundary>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Recipe Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter recipe name"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description of the recipe"
                  {...register('description')}
                  className={errors.description ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Yield Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yieldQuantity">
                  Yield Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="yieldQuantity"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="1"
                  {...register('yieldQuantity', { valueAsNumber: true })}
                  className={errors.yieldQuantity ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.yieldQuantity && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.yieldQuantity.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="yieldUnit">
                  Yield Unit <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setValue('yieldUnit', value as any)}
                  defaultValue="each"
                  disabled={isSubmitting}
                >
                  <SelectTrigger className={errors.yieldUnit ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.yieldUnit && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.yieldUnit.message}
                  </p>
                )}
              </div>
            </div>

            {/* Time Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prepTime">Prep Time (minutes)</Label>
                <Input
                  id="prepTime"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register('prepTime', { valueAsNumber: true })}
                  className={errors.prepTime ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.prepTime && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.prepTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cookTime">Cook Time (minutes)</Label>
                <Input
                  id="cookTime"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register('cookTime', { valueAsNumber: true })}
                  className={errors.cookTime ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.cookTime && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.cookTime.message}
                  </p>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>
                  Ingredients <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ itemId: '', quantity: 0, notes: '' })}
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg">
                  <div className="md:col-span-4 space-y-2">
                    <Label htmlFor={`ingredients.${index}.itemId`}>Ingredient</Label>
                    <Select
                      onValueChange={(value) => setValue(`ingredients.${index}.itemId`, value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={errors.ingredients?.[index]?.itemId ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select ingredient" />
                      </SelectTrigger>
                      <SelectContent>
                        {ingredients.map((item) => (
                          <SelectItem key={item.itemId} value={item.itemId}>
                            {item.name} ({item.inventoryUnit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.ingredients?.[index]?.itemId && (
                      <p className="text-sm text-red-500">{errors.ingredients[index]?.itemId?.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor={`ingredients.${index}.quantity`}>Quantity</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0"
                      {...register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                      className={errors.ingredients?.[index]?.quantity ? 'border-red-500' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.ingredients?.[index]?.quantity && (
                      <p className="text-sm text-red-500">{errors.ingredients[index]?.quantity?.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <Label htmlFor={`ingredients.${index}.notes`}>Notes</Label>
                    <Input
                      placeholder="Optional notes"
                      {...register(`ingredients.${index}.notes`)}
                      className={errors.ingredients?.[index]?.notes ? 'border-red-500' : ''}
                      disabled={isSubmitting}
                    />
                    {errors.ingredients?.[index]?.notes && (
                      <p className="text-sm text-red-500">{errors.ingredients[index]?.notes?.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2 flex items-end">
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

              {errors.ingredients && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.ingredients.message}
                </p>
              )}
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Step-by-step instructions for this recipe..."
                {...register('instructions')}
                className={errors.instructions ? 'border-red-500' : ''}
                disabled={isSubmitting}
                rows={6}
              />
              {errors.instructions && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.instructions.message}
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Recipe
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
