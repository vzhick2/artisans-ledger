### **Document 4: Development & QA Handbook**

**Purpose:** This is a practical guide for the developer. It contains all the standards, processes, and checklists needed to write high-quality, consistent code and to deploy the application reliably and securely.

---

### **1\. Global UI & UX Patterns**

This section defines application-wide standards for user experience to ensure consistency and quality across all views.

* **Validation:**  
    
  * **Inline:** All required fields, negative values, duplicates, or unknown entries must trigger immediate, inline error messages with clear, actionable text. The form should not be submittable while errors are present.  
  * **Server-Side:** All data mutations must be re-validated on the server (within the PostgreSQL function or API route) before being committed to the database. This acts as a security backstop.


* **User Feedback:**  
    
  * **Toasts:** Every major create, update, or delete action (e.g., saving a purchase, archiving an item) must trigger a brief "toast" notification in the corner of the screen confirming success.  
  * **Undo:** The success toast should optionally contain an "Undo" button, allowing the user to revert the action for a few seconds.  
  * **Micro-History:** Detail views or modals should display a subtle text indicator of the last edit (e.g., “*Last edited 5 mins ago by \[user\]*”).


* **Data Entry Efficiency:**  
    
  * **Bulk Paste:** Key spreadsheet-style grids (Purchases, Batches, Recipes, Sales) must support pasting data directly from Excel/CSV. The application will parse the pasted text and populate the grid rows.  
  * **Keyboard Navigation:** All data grids and forms must be fully navigable using the keyboard (Tab, Shift+Tab, Arrow Keys, Enter). This is essential for power users and accessibility.  
  * **Hotkeys:** Implement global hotkeys for common actions (e.g., `Cmd/Ctrl + K` to open a search bar, `N` to open a "New Item" form). An overlay hint (`?`) should display a list of available shortcuts.


* **Personalization & Theming:**  
    
  * **Stateful UI:** The application should remember user-specific preferences, such as the last view they were on, their chosen filters for a table, or their table display mode (compact/expanded).  
  * **Dark Mode:** A toggle in the user menu or settings will switch the application between light and dark themes.


* **Visual Design & Indicators:**  
    
  * **Status Indicators:** Use colored dots or bands on table rows to provide at-a-glance information (e.g., green for "In Stock," yellow for "Reorder," red for "Out of Stock," gray for "Archived").  
  * **Help & Onboarding:** Use inline info icons (`?`) next to complex fields (like "Weighted Average Cost") that show a descriptive tooltip on hover.


* **Accessibility:**  
    
  * The application must adhere to modern accessibility standards. This includes full keyboard navigation, sufficient color contrast in both light and dark modes, scalable font sizes, and proper `aria-labels` on all interactive controls.

---

### **2\. Testing & Quality Assurance Strategy**

* **Code Style & Linting:**  
    
  * **Requirement:** The project must be configured with **ESLint** and **Prettier**. A pre-commit hook will be used to automatically format all code, ensuring a consistent style across the entire codebase. This is critical for improving the effectiveness of AI coding assistants.


* **Unit Testing:**  
    
  * **Framework:** **Vitest** is recommended for its speed and modern API, though Jest is also a suitable choice.  
  * **Priority:** The highest priority for unit testing is the suite of **PostgreSQL Functions (RPCs)**. Each function (`log_purchase`, `log_batch`, etc.) must have tests that verify it correctly handles valid inputs, rejects invalid inputs, and performs all database mutations accurately and atomically.


* **End-to-End (E2E) Testing:**  
    
  * **Strategy:** E2E testing is a post-MVP goal. Once the core application is stable, a tool like **Playwright** (recommended for its modern features) or **Cypress** will be implemented.  
  * **Priority Flows:** The first E2E tests will cover the most critical user workflows:  
    1. Logging a new purchase and verifying the inventory and cost updates.  
    2. Creating a recipe and then logging a batch from it, verifying all inventory changes.

---

### **3\. Environment & Deployment Strategy**

* **Environments & Data Isolation:**  
    
  * **Development:** For local development on the developer's machine. Will connect to a dedicated **`artisans-ledger-dev`** Supabase project.  
  * **Preview:** Vercel will automatically generate preview deployments from GitHub pull requests. These will also connect to the `dev` Supabase project.  
  * **Production:** The live application, which is deployed automatically when code is merged into the `main` branch. This environment will connect to a completely separate **`artisans-ledger-prod`** Supabase project.  
  * **CRITICAL:** The strict separation of development and production databases is a non-negotiable security and stability measure.


* **Progressive Web App (PWA) Strategy:**  
    
  * **MVP:** The initial application will be a fully responsive website, ensuring a good experience on all screen sizes.  
  * **Post-Launch Enhancement:** After the MVP is stable, basic PWA functionality will be added to make the application "installable" on a user's home screen. This will be achieved by adding a web manifest and a service worker, likely using a library like `next-pwa`.  
  * **Future Goal:** Rich offline functionality will only be considered if a strong user need is identified.

---

### **4\. Initial Development Setup Checklist**

This is an actionable checklist to bootstrap the project from scratch.

1. Initialize a new Git repository locally (`git init`) and create a corresponding private repository on GitHub.  
2. Use the command `npx create-next-app@latest` to initialize the Next.js application. Select options for TypeScript, ESLint, and Tailwind CSS.  
3. Create two new projects on the Supabase dashboard: `artisans-ledger-dev` and `artisans-ledger-prod`.  
4. Install the Supabase client library into the Next.js project: `npm install @supabase/supabase-js`.  
5. Create a `.env.local` file in the project's root directory. Populate it with the API URL and `anon` key for the `artisans-ledger-dev` project.  
6. Ensure `.env.local` is added to the `.gitignore` file to prevent secrets from being committed.  
7. Using the Supabase SQL Editor, create all the required database tables as defined in **Document 2: System Architecture & Data Model**. Enable Row Level Security (RLS) on all tables that contain user data.  
8. Initialize `shadcn/ui` in the project by running its `init` command.  
9. Create the initial folder structure inside the `/app` directory, with subfolders corresponding to the main navigation views (e.g., `/app/dashboard`, `/app/items`).  
10. Write the first data-fetching component to test the Supabase connection (e.g., a simple page that lists all created `Suppliers`).  
11. Make the first commit, push the code to the GitHub repository, and connect the repository to Vercel to set up the CI/CD pipeline.

