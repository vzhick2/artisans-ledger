### **Document 2: System Architecture & Data Model**

**Purpose:** This is the master technical document. It describes the "how" of the application's foundation, from the high-level technologies down to the specific database fields and API structure.

---

**1\. Core Technology Stack (Decided & Locked-In)**

* **Frontend Framework: Next.js (React)**  
    
  * **Status:** Locked-In.  
  * **Justification:** Provides a comprehensive solution for the user interface, server-side rendering, and API layer. As of 2025, it remains the dominant React framework and industry standard, with a vast library of examples, making it ideal for AI code generation.


* **Backend Platform: Supabase**  
    
  * **Status:** Locked-In.  
  * **Justification:** As an all-in-one Backend-as-a-Service (BaaS), Supabase dramatically reduces complexity by consolidating the database (PostgreSQL), user authentication, and file storage. Its foundation on open-source PostgreSQL provides a powerful, standard, and AI-friendly environment for data management.


* **Version Control & Repository: GitHub**  
    
  * **Status:** Locked-In.  
  * **Justification:** The definitive platform for version control due to its deep, native integration with GitHub Copilot. This provides the most seamless and powerful AI-assisted development experience available.

**2\. Frontend & Deployment Architecture (Decided)**

* **Component Architecture: `shadcn/ui` & `Tailwind CSS`**  
    
  * **Status:** Decided.  
  * **Justification:** This combination remains the most popular and recommended approach for building custom UIs in the React ecosystem as of 2025\. `shadcn/ui` components are copied into the project as source code, giving the AI direct access to modify standard React and HTML patterns.


* **Hosting & Deployment Platform: Vercel**  
    
  * **Status:** Decided.  
  * **Justification:** As the creator of Next.js, Vercel offers a "zero-configuration," seamless deployment pipeline optimized for the framework. This automated CI/CD allows the developer to focus the AI on writing application code, not complex deployment scripts.

**3\. Backend Logic & API Layer (Decided)**

* **Core Business Logic: PostgreSQL Functions (RPC)**  
  * **Status:** Decided.  
  * **Justification:** All critical, multi-step business logic (e.g., inventory transactions, weighted average cost calculations) will be enforced via secure PostgreSQL functions within Supabase. This ensures atomicity and data integrity at the database level.

**4\. Technology Decisions To Be Made**

* **Data Grid/Table Library:**  
    
  * **Status:** To Be Decided.  
  * **Leading Recommendation:** **TanStack Table (React Table)** for its flexibility and "headless" design, which aligns perfectly with `shadcn/ui`.  
  * **Alternative:** **AG Grid** if more complex, built-in enterprise features are deemed necessary during development.


* **State Management & Data Fetching Library:**  
    
  * **Status:** To Be Decided.  
  * **Leading Recommendation:** **TanStack Query (React Query)** for its robust handling of server state, caching, and background synchronization.  
  * **Alternative:** **Zustand** can be added alongside TanStack Query if a simple solution for managing global UI state is required.


* **Error Tracking & Application Monitoring:**  
    
  * **Status:** To Be Decided.  
  * **Leading Recommendation:** Begin with the built-in logs from Vercel and Supabase. Add **Sentry** (which has a useful free tier) post-launch for automated error reporting once the app is in regular use.

**5\. Data Model & Schema**

This section defines the formal database schema. All tables will have **Row Level Security (RLS)** enabled in Supabase to ensure users can only access their own data. Primary keys will be `UUID`.

* **`suppliers`**  
  * `supplierId`, `name`, `storeUrl`, `phone`, `isArchived`  
* **`items`**  
  * `itemId`, `name`, `SKU`, `type` (enum: 'ingredient', 'packaging', 'product'), `isArchived`, `inventoryUnit`, `currentQuantity` (numeric), `weightedAverageCost` (numeric), `reorderPoint` (numeric), `lastCountedDate` (date)  
* **`recipes`**  
  * `recipeId`, `name`, `version` (integer), `isArchived`, `yieldsItemId` (foreign key to `items`), `expectedYield` (numeric), `laborMinutes` (integer), `projectedMaterialCost` (numeric)  
* **`recipe_ingredients`** (Join Table)  
  * `recipeIngredientId`, `recipeId` (foreign key to `recipes`), `itemId` (foreign key to `items`), `quantity` (numeric)  
* **`purchases`**  
  * `purchaseId`, `supplierId` (foreign key to `suppliers`), `purchaseDate` (date), `grandTotal` (numeric), `notes` (text)  
* **`purchase_line_items`**  
  * `purchaseLineItemId`, `purchaseId` (foreign key to `purchases`), `itemId` (foreign key to `items`), `quantity` (numeric), `unitCost` (numeric), `totalCost` (numeric), `lotNumber` (text)  
* **`batches`**  
  * `batchId`, `recipeId` (foreign key to `recipes`), `dateCreated` (date), `qtyMade` (numeric), `yieldPercentage` (numeric), `materialCost` (numeric), `laborCost` (numeric), `actualCost` (numeric), `costVariance` (numeric), `notes` (text)  
* **`transactions`** (The Immutable Ledger)  
  * `transactionId`, `itemId` (foreign key to `items`), `quantityChange` (numeric), `newQuantity` (numeric), `type` (enum: 'purchase', 'batch\_usage', 'batch\_creation', 'spot\_check', 'sale'), `sourceId` (UUID linking to the source record), `timestamp`  
* **`spot_checks`**  
  * `spotCheckId`, `itemId` (foreign key to `items`), `previousQuantity` (numeric), `newQuantity` (numeric), `reason` (text), `notes` (text)  
* **`cost_history`**  
  * `costHistoryId`, `itemId` (foreign key to `items`), `newCost` (numeric), `triggeringPurchaseId` (foreign key to `purchases`), `timestamp`  
* **`sales_months`**  
  * `salesMonthId`, `itemId` (foreign key to `items`), `year` (integer), `month` (integer), `quantitySold` (numeric), `dataSource` (enum: 'manual', 'imported')

**6\. API Layer & Business Logic Plan**

All database mutations involving business logic will be handled by secure PostgreSQL functions callable via RPC from the Next.js application. This ensures data integrity and atomicity.

* **`func_log_purchase(purchase_data)`:**  
  * **Action:** A single atomic transaction that creates a `purchases` record, iterates through line items to create `purchase_line_items`, and for each item, updates its `currentQuantity` and recalculates its `weightedAverageCost`. It must create corresponding entries in the `transactions` and `cost_history` tables.  
* **`func_log_batch(batch_data)`:**  
  * **Action:** An atomic transaction that reads a recipe's ingredients, decrements ingredient inventory, increases the finished product's inventory, and creates all corresponding `transactions` ledger entries.  
* **`func_perform_spot_check(check_data)`:**  
  * **Action:** An atomic transaction that updates an item's `currentQuantity` and creates a `transactions` ledger entry to record the correction and its reason.

