# 💸 Financial Dashboard – Budget & Expense Tracker

A modern web application to help users **track expenses, manage budgets**, and **visualize financial data** with beautiful, interactive charts. Built using Angular and Django REST Framework.

🌐 **Live App**: [https://budget-tracker-frontend-ten-kappa.vercel.app/](https://budget-tracker-frontend-ten-kappa.vercel.app/)  
📦 **Postman API Documentation**: [https://documenter.getpostman.com/view/16190316/2sB2qXn43q](https://documenter.getpostman.com/view/16190316/2sB2qXn43q)  
🌐 **Backend API**: [https://budget-tracker-rsz8.vercel.app/api/](https://budget-tracker-rsz8.vercel.app/api/)  
📦 **GitHub Repo**: [https://github.com/samarth1011/budget-tracker](https://github.com/samarth1011/budget-tracker)

---

## 🚀 Features

### 📊 Dashboard
- Overview of total income, expenses, and budget left
- Monthly income vs. expense chart
- Category-wise expense pie chart
- Budget usage bar chart

### 🧾 Transactions
- Add, edit, and delete income or expense entries
- Advanced filtering: date range, category, and amount
- Pagination and clear visual layout

### 🗂️ Categories
- Add and manage custom expense categories
- Categories dynamically integrated into filters and dashboards

### 📈 Budgets
- Set monthly spending budgets
- Monitor actual vs. budgeted expenses
- View usage trends visually

---

## 🛠 Tech Stack

| Layer     | Technology       |
|-----------|------------------|
| Frontend  | Angular, Bootstrap 5 |
| Backend   | Django + Django REST Framework |
| Charts    | D3.js (for all financial visualizations) |
| Auth      | JWT-based Authentication |
| Hosting   | Vercel (Frontend),(Backend) |

---

## 🖼️ UI Preview

> Responsive, clean layout with intuitive navigation  
> Smart filters, CRUD operations, and real-time charts  
>  
>![Dashboard](image.png)
>![Transactions](image-1.png)
>![Categories](image-2.png)
>![Budget](image-3.png)
>![Add Transaction](image-4.png)

---

## 🔧 Getting Started

### Backend – Django
```bash
cd budget_tracker/
python -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

cd budget-tracker-frontend/
npm install
ng serve

```
Then visit: http://localhost:4200

---

## 🧪 API Endpoints (Django REST)

- GET/POST /api/transactions/

- GET/POST /api/categories/

- GET/POST /api/budgets/

## 📊 Visualizations

- Built using D3.js and Angular, including:

- Pie chart for category distribution

- Bar Chart for month expense comparison

