### **Document 1: Product Vision & UX Blueprint**

**Purpose:** This document describes the "what" from the user's perspective. It is a pure product document that details what the user will see, do, and experience in every part of the application.

---

**Sidebar Navigation**

* Dashboard  
* Items  
* Recipes  
* Suppliers  
* Purchases  
* Batches  
* Spot Checks  
* Sales  
* Ledger  
* Reports  
* Settings

*User Experience Note: The sidebar is user-customizable. The user can reorder or hide navigation tabs, with the exception of Dashboard and Settings. On mobile devices, less-frequently used views will nest under a “More” menu to save space.*

---

**1\. Dashboard**

* **Metric Cards:** A set of always-visible cards at the top of the view displaying key real-time metrics: **Inventory Value**, **Open Purchase Orders**, **Batches This Month**, and **Average Yield %**.  
* **Action Center:** A dynamic section that highlights urgent operational needs. This includes a list of low-stock or out-of-stock items, with each item having an associated action button (e.g., “Start Purchase,” “Log Batch”).  
* **Inventory Status Bar/Table:** A high-level overview of inventory health, showing real-time counts for items that are **In Stock**, need **Reorder**, or are **Out of Stock**. Clicking on any status category will navigate the user to the Items view, pre-filtered by that status.  
* **Empty State:** For first-time users with no data, this area will display an onboarding box with a clear call-to-action, such as “Add your first Item” or “Log your first Purchase.”  
* **Edge Case:** If a metric cannot be calculated (e.g., no items exist to determine inventory value), it will display “N/A” with a tooltip explaining why.

**2\. Items**

* **Main Table/Grid:** A detailed table of all items with columns for **Name**, **Type** (ingredient, packaging, product), **Quantity**, **Cost**, **Reorder Point**, **Status** (a color dot indicating stock level), **Last Counted Date**, and **Actions** (Edit, Archive).  
* **Search & Filter:** A powerful search bar for finding items by name or SKU, with multi-select filters for item type, stock status, or archived state.  
* **Row Interaction:** Edit and Archive buttons will appear upon hovering over a row.  
* **Detail View (Drawer/Modal):** Clicking a row opens a detailed view with several tabs:  
  * **Info:** Displays key static data like SKU, the item's default inventory unit (e.g., grams, pcs), and its assigned supplier.  
  * **Cost History:** A table showing all historical changes to the item's weighted average cost, including the date of the change and the source (e.g., a specific purchase, batch, or spot check).  
  * **Transaction Log:** A complete, immutable history of every stock change for the item, filterable by transaction type, source, or date range.  
* **Archive/Reactivate:** The user can archive an item. If the item is currently used in an active recipe or open batch, the system will show a confirmation modal with a clear warning before proceeding.

**3\. Recipes**

* **List by Product:** A list showing all final products. Each entry displays the recipe **Name**, **Version**, **Expected Yield**, and an estimated **Labor Time**.  
* **Expand for History:** The user can expand a recipe entry to view archived or older versions for historical comparison.  
* **Detail View & Production Planning:** Clicking on a recipe opens its detail page, which includes:  
  * An on-demand calculation showing the **Number of Batches Possible** based on current inventory levels. The system will also highlight which specific ingredient is the **Limiting Factor**.  
  * **Tabs:**  
    * **Ingredients:** A list of all required ingredients, each with its required quantity and unit.  
    * **Batch History:** A log of all batches ever produced from this recipe, showing date, quantity made, yield percentage, and any notes.  
    * **Efficiency Stats:** Key performance indicators like average yield percentage, and best/worst production runs.  
    * **Actions:** Buttons to Edit, Copy, or Archive the recipe.  
* **Add/Edit Recipe Form:** A spreadsheet-style grid for entering ingredients that supports bulk pasting from Excel. Includes fields for recipe name, expected yield, and labor minutes.

**4\. Suppliers**

* **Table View:** A sortable table with columns for **Supplier Name**, **Website** (clickable), **Phone Number**, and an **Archive/Reactivate** action.  
* **Detail View:** Clicking a supplier opens a panel showing their contact info alongside a filterable and sortable table of all items ever purchased from them, including the item name, last price paid, quantity, and last purchase date.

**5\. Purchases**

* **List View:** A searchable and filterable list of all past purchases, showing **Date**, **Supplier**, **Grand Total**, and any high-level notes. Includes a "Reverse/Correct" button for each entry.  
* **Log Purchase Worksheet:** A spreadsheet-style grid for logging new purchases. Columns include **Item** (with auto-complete), **Quantity**, **Unit** (auto-filled based on the selected item), **Unit Cost**, **Total Cost** (auto-calculated), **Lot \#**, and **Notes**.  
* **Smart Helpers:**  
  * **Unit Conversion Helper:** A self-contained UI calculator to assist the user in converting common units (e.g., pounds, ounces) into the system's required base unit (e.g., grams) for the quantity field. This helper does not save the original input.  
  * **Cost Density Feedback:** As a sanity check, a read-only text field will appear below the cost inputs, displaying the calculated cost in the base unit (e.g., "$0.0022 per gram") to help the user spot pricing errors.  
  * **Auto-Calculation:** The **Total Cost** for each line item is automatically calculated as the user enters the **Quantity** and **Unit Cost**. A running **Grand Total** for the entire purchase is always visible.

**6\. Batches**

* **List View:** A searchable list of all production batches, with columns for **Batch ID**, **Recipe/Version**, **Date**, **Quantity Made**, **Yield %**, **Material Cost**, **Labor Cost**, **Total Cost**, and a "Reverse/Correct" action.  
* **Log Batches Worksheet:** A spreadsheet-style grid designed for quick entry of multiple batches. Includes fields for Recipe (auto-complete), Version, Quantity Made, Date, and Notes. Yield percentage and all costs are auto-calculated upon saving.

**7\. Spot Checks**

* **History Log:** A view showing all historical inventory corrections. Columns include **Item**, **Previous Quantity**, **New Quantity**, **Reason**, the calculated **Variance**, and the **Date** of the check.  
* **New Spot Check Form:** A simple form where a user can search for and select an item, then enter the new physical count and provide a reason for the adjustment.

**8\. Sales**

* **Sales Table:** A table of all logged sales with columns for **Product**, **Year**, **Month**, **Quantity Sold**, **Data Source** (e.g., manual or imported), **Notes**, and **Edit/Delete** actions.  
* **Add/Edit Sale Form:** A simple inline or modal editor with product auto-complete, a month/year picker, and a quantity input. Supports bulk paste from spreadsheets.

**9\. Ledger**

* **Table View:** A complete, immutable log of every transaction that has ever affected inventory. Columns include **Transaction ID**, **Date**, **Item**, **Transaction Type** (e.g., purchase, batch usage), **Quantity Change (+/-)**, **New Quantity**, and the **Source** (e.g., purchase ID, batch ID). The table is filterable and exportable.  
* **Drill-Down:** Clicking on any transaction's source ID will navigate the user directly to the corresponding purchase, batch, or spot check record.

**10\. Reports**

* **Tabbed Interface:** A dedicated section for various reports, including **Inventory Value**, **Production Throughput**, **Supplier Spend**, **Product Margins**, **Ingredient Usage**, and **Stock Coverage/Production Planning**.  
* **Stock Coverage Report:** An interactive report where the user sets a target number of weeks to cover. The system then displays a table showing each product, its average weekly sales, the needed units to meet the target, and the source of the sales data.

**11\. Settings**

* **General:** A form for company information and setting the business-wide **labor rate** for cost calculations.  
* **Data Management:** Tools for bulk import/export of all major data entities (Items, Suppliers, etc.).  
* **Change Log:** An audit log showing all edits made to business-level settings.

