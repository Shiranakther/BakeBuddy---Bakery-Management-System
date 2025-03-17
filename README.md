# 🍞 BakeBuddy - Comprehensive Bakery Management System  

Welcome to **BakeBuddy**, an all-in-one bakery management system designed to streamline operations for mid-sized and large bakeries. BakeBuddy simplifies inventory handling, production tracking, sales monitoring, and role-based user management while incorporating **SmartBake**, an AI-powered feature that optimizes ingredient usage.

## 🌟 Key Features  

## 🧠 SmartBake - AI-Powered Optimization  

🚀 **SmartBake** is our intelligent AI-driven feature that:  
- Identifies slow-moving items based on sales data.  
- Suggests alternative recipes using existing ingredients.  
- Helps reduce production costs and introduces new items to boost sales.  
 

<details>
  <summary>📦 Ingredient Management</summary>
  - Add and manage ingredients used in bakery production.  
  - Track ingredient usage and stock levels in real time.  
  - Maintain supplier details and procurement history.  
  _Developed by: **T.A.P.K. Shameera**_
</details>

<details>
  <summary>🍰 Item Management</summary>
  - Create and categorize bakery items.  
  - Assign ingredients to each item for accurate inventory tracking.  
  - Update item details.
  - Gererate Item Report
  _Developed by: **R.I.S.R. Pinto**_
</details>

<details>
  <summary>💰 Sales Management</summary>
  - Record and manage daily sales transactions.  
  - Generate sales reports for performance analysis.  
  - Track best-selling and slow-moving items.  
  _Developed by: **A.M.D.C.Kumara**_
</details>

<details>
  <summary>🛠️ Production Management</summary>
  - Log daily production batches.  
  - Automatically adjust ingredient inventory based on production.  
  - Monitor production efficiency and wastage.  
  _Developed by: **M.H. Shiran Akther**_
</details>

<details>
  <summary>🔑 User Management (Role-Based Access)</summary>
  - Secure system with admin, staff, and manager roles.  
  - Manage permissions for different levels of access.  
  - Keep track of user activities and logins.  
  _Developed by: **Dilshan Chamikara**_
</details>


## 🛠️ Tech Stack  
- **Frontend:** React.js  
- **Backend:** Node.js / Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT-based Role Management  
- **AI Model:** Custom Algorithm for Recipe Suggestions  

## 📌 Installation Guide  
```bash
# Clone the repository
https://github.com/Shiranakther/BakeBuddy---Bakery-Management-System.git

# Navigate to the project folder
cd bakebuddy

# Install dependencies
npm install

#In backend folder create .env Folder and include
PORT = 'port number'
CONNECTION_STRING = 'Database connection url mongodb'

# Start the application
npm run dev
