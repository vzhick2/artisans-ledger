### **Document 3: Project Roadmap & Sprints**

**Purpose:** This document focuses on project management. It breaks down the entire application build into logical, sequential sprints. It defines what constitutes the Minimum Viable Product (MVP), tracks key strategic simplifications, and answers "when" and "in what order" features will be built.

---

### **1\. Project Roadmap & MVP Feature Sprints**

The project will be built in four distinct sprints. Each sprint has a clear goal, a set of features to be implemented, and User Acceptance Criteria (UAC) to define when a story is considered "done."

#### **Sprint 1: Core Setup & Foundational Data**

* **Goal:** To establish the project's technical foundation and build the core, non-transactional data models. This sprint focuses on being able to view and manage the basic "nouns" of the system.  
* **Key Features:**  
  * Full project setup (GitHub, Next.js, Supabase, Vercel).  
  * Items view with full CRUD (Create, Read, Update, Delete) functionality.  
  * Suppliers view with full CRUD functionality.  
* **User Stories & Acceptance Criteria (UAC):**  
  * **Story:** As a user, I can add a new item to my inventory.  
    * **UAC:** Given I am on the Items page, when I click "Add New Item," then a form/modal appears with fields for name, type, SKU, and unit.  
    * **UAC:** Given I fill out the form correctly and click "Save," then the new item appears in the main items list without a page reload.  
    * **UAC:** Given I try to save the form with the "Name" field empty, then an inline validation error appears, and the form does not submit.  
* **Technical Focus:** Initial Next.js setup, connecting to Supabase, designing the first data tables, implementing basic `SELECT`/`INSERT`/`UPDATE` queries, and setting up the TanStack Table component for the first time.

#### **Sprint 2: Inventory Inflow & Costing Engine**

* **Goal:** To build the complete workflow for acquiring new inventory. This is the first transactional sprint and involves implementing the critical costing and ledger logic.  
* **Key Features:**  
  * Purchases list view.  
  * The "Log Purchase" worksheet with its spreadsheet-style grid.  
  * The frontend "Smart Helper" for unit conversions.  
  * The backend logic for Weighted Average Cost (WAC) calculation.  
* **User Stories & Acceptance Criteria (UAC):**  
  * **Story:** As a user, I can log a new purchase of several items from a supplier.  
    * **UAC:** Given I log a successful purchase, then the `currentQuantity` for each purchased item is correctly increased.  
    * **UAC:** Given I log a successful purchase, then the `weightedAverageCost` for each purchased item is accurately recalculated.  
    * **UAC:** Given I log a successful purchase, then a new, immutable transaction record is created in the `transactions` (Ledger) table for each line item.  
* **Technical Focus:** Building the complex `log_purchase` PostgreSQL function (RPC), implementing the WAC algorithm in SQL, creating the interactive purchase worksheet UI, and developing the frontend-only "Smart Helper" components.

#### **Sprint 3: Production Engine (Recipes & Batches)**

* **Goal:** To build the core manufacturing workflow, allowing users to define how products are made and to log production runs that consume materials and create finished goods.  
* **Key Features:**  
  * Recipes view with full CRUD functionality.  
  * Batch logging worksheet.  
  * The on-demand "batches possible" calculation on the recipe detail view.  
* **User Stories & Acceptance Criteria (UAC):**  
  * **Story:** As a user, I can log a new production batch based on a recipe.  
    * **UAC:** Given I log a batch, then the `currentQuantity` of all required ingredients is correctly reduced based on the recipe.  
    * **UAC:** Given I log a batch, then the `currentQuantity` of the finished product is correctly increased.  
    * **UAC:** Given I log a batch, then corresponding "batch\_usage" and "batch\_creation" records are created in the `transactions` ledger.  
* **Technical Focus:** Building the `log_batch` PostgreSQL function, which is the most complex RPC as it involves multiple inventory deductions and one addition in a single transaction.

#### **Sprint 4: Operations, Analysis & Polish**

* **Goal:** To complete the inventory lifecycle with sales tracking and corrections, and to provide high-level business insights through the dashboard and reports.  
* **Key Features:**  
  * Sales data entry view.  
  * Spot Checks view for manual inventory corrections.  
  * The main Dashboard with its real-time metric cards and action center.  
* **User Stories & Acceptance Criteria (UAC):**  
  * **Story:** As a user, I can perform a spot check to correct the quantity of an item.  
    * **UAC:** Given I submit a spot check, then the item's `currentQuantity` is updated to the new count.  
    * **UAC:** Given I submit a spot check, then a "spot\_check" transaction is recorded in the ledger, showing the variance.  
* **Technical Focus:** This sprint is primarily frontend-focused, involving data visualization and building components that display aggregated data from the backend.

---

### **2\. MVP Scope Definition**

* **IN SCOPE FOR MVP:**  
    
  * All features detailed in the four sprints above.  
  * The complete, end-to-end inventory lifecycle: Purchases \-\> Items \-\> Recipes \-\> Batches \-\> Sales.  
  * The foundational financial engine: Weighted Average Costing and the Immutable Ledger.  
  * Key UI Helpers: The Unit Conversion "Smart Helper" on the purchases screen.


* **OUT OF SCOPE FOR MVP (To Be Considered for Future Versions):**  
    
  * Barcode/QR code generation and scanning.  
  * Deep third-party API integrations (e.g., with e-commerce or accounting platforms).  
  * Advanced analytics dashboards (e.g., ABC analysis, product bundle analysis).  
  * Full, rich offline PWA capabilities.

---

### **3\. Deferred / Simplified Features for MVP**

This section tracks strategic decisions made to reduce initial complexity and ensure a successful MVP launch.

* **Recipes View \- "Batches Possible" Calculation:**  
  * **Simplification:** The calculation of how many batches can be produced will not be shown on the main recipe list view. Instead, it will be performed and displayed on-demand when a user navigates to a single recipe's detail page. This avoids heavy, unnecessary calculations and improves performance.  
* **Unit Conversions:**  
  * **Simplification:** The application will not have a system-wide, user-configurable unit conversion engine. This complex feature is replaced by a frontend-only "Smart Helper" UI on the Purchases screen to assist with one-off conversions at the point of data entry, without adding backend or database complexity.  
* **Progressive Web App (PWA) Functionality:**  
  * **Simplification:** The MVP will be a fully responsive web application that works well on any device. Rich PWA features like home screen installability and offline access are considered post-launch enhancements, not initial requirements.

