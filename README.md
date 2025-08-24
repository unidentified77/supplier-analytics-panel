# Loncada Supplier Sales Dashboard

A React, Node.js, and MongoDB based dashboard for Loncada suppliers to monitor their sales performance. The dashboard provides visual insights into monthly sales trends and detailed product-level sales data.

---

## Features

* **Monthly Sales Chart:** Visualize total sales per month in a line chart.
* **Product Sales Table:** View total quantity sold and revenue per product, with pagination.
* **Responsive Design:** Works on desktop and mobile screens.

---

## Technologies Used

* **Frontend:** React, Chart.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Styling:** 

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/loncada-sales-dashboard.git
```

2. Navigate to the project folder:

```bash
cd loncada-sales-dashboard
```

3. Install backend dependencies:

```bash
cd backend
npm install
```

4. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

5. Create a `.env` file in the backend folder and add your MongoDB URI:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

6. Start the backend server:

```bash
cd ../backend
npm start
```

7. Start the frontend:

```bash
cd ../frontend
npm start
```

The dashboard will be available at `http://localhost:3000`.

---

## Usage

* **Monthly Sales Chart:** Automatically loads the total sales per month. Hover over points to see exact values.
* **Product Sales Table:** Browse products with pagination. See total quantity sold and revenue per product.

---

## Customization

* Replace logos and branding in the `/frontend/assets` folder.
* Adjust chart colors and table styling in the component files.

---

## Notes

* Make sure MongoDB is running and your `.env` is correctly configured.
* For production, consider using a logging library instead of `console.log`.
* Ensure proper error handling in the backend to handle database connection issues gracefully.

---
