import { z } from "zod"

// Item validation schema
export const itemSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  sku: z.string().min(1, "SKU is required").max(50, "SKU must be less than 50 characters"),
  type: z.enum(["ingredient", "packaging", "product"], {
    required_error: "Type is required"
  }),
  inventoryUnit: z.enum(["lbs", "oz", "kg", "g", "each", "gallon", "liter", "cup"], {
    required_error: "Inventory unit is required"
  }),
  reorderPoint: z.number().min(0, "Reorder point must be 0 or greater"),
  initialQuantity: z.number().min(0, "Initial quantity must be 0 or greater"),
  unitCost: z.number().min(0, "Unit cost must be 0 or greater"),
})

// Batch validation schema
export const batchSchema = z.object({
  recipeId: z.string().min(1, "Recipe is required"),
  quantityMade: z.number().min(0.01, "Quantity made must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
})

// Purchase validation schema
export const purchaseLineItemSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unitCost: z.number().min(0, "Unit cost must be 0 or greater"),
  lotNumber: z.string().max(50, "Lot number must be less than 50 characters").optional(),
  notes: z.string().max(200, "Notes must be less than 200 characters").optional(),
})

export const purchaseSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
  lineItems: z.array(purchaseLineItemSchema).min(1, "At least one line item is required"),
})

// Supplier validation schema
export const supplierSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  contactName: z.string().max(100, "Contact name must be less than 100 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().max(20, "Phone must be less than 20 characters").optional(),
  address: z.string().max(200, "Address must be less than 200 characters").optional(),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
})

// Recipe validation schema
export const recipeIngredientSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  notes: z.string().max(100, "Notes must be less than 100 characters").optional(),
})

export const recipeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  yieldQuantity: z.number().min(0.01, "Yield quantity must be greater than 0"),
  yieldUnit: z.enum(["lbs", "oz", "kg", "g", "each", "gallon", "liter", "cup"], {
    required_error: "Yield unit is required"
  }),
  prepTime: z.number().min(0, "Prep time must be 0 or greater"),
  cookTime: z.number().min(0, "Cook time must be 0 or greater"),
  instructions: z.string().max(2000, "Instructions must be less than 2000 characters").optional(),
  ingredients: z.array(recipeIngredientSchema).min(1, "At least one ingredient is required"),
})

// Spot check validation schema
export const spotCheckSchema = z.object({
  itemId: z.string().min(1, "Item is required"),
  countedQuantity: z.number().min(0, "Counted quantity must be 0 or greater"),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
})

// Sales validation schema
export const salesSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unitPrice: z.number().min(0, "Unit price must be 0 or greater"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
})

// Type exports
export type ItemFormData = z.infer<typeof itemSchema>
export type BatchFormData = z.infer<typeof batchSchema>
export type PurchaseFormData = z.infer<typeof purchaseSchema>
export type PurchaseLineItemFormData = z.infer<typeof purchaseLineItemSchema>
export type SupplierFormData = z.infer<typeof supplierSchema>
export type RecipeFormData = z.infer<typeof recipeSchema>
export type RecipeIngredientFormData = z.infer<typeof recipeIngredientSchema>
export type SpotCheckFormData = z.infer<typeof spotCheckSchema>
export type SalesFormData = z.infer<typeof salesSchema>
