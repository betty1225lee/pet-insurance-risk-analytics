# Pet Insurance Policy and Claims Management and Analytics Platform

A full-stack pet insurance data product built with **FastAPI**, **React**, and **PostgreSQL**. This tool provides a reliable tracking mechanism for policy applications and claims,live analytics dashboarding, and ad-hoc batch analysis.


**For detailed system architecture, API specs, and data flow diagrams, see the [Full Project Report](./docs/Report.md).**

---

## Key Features

- **Policy Management:** Review pending policy applications and activate eligible accounts.
- **Claims Management:** Process claim submissions (Pending to Approved) to update financial and analytics metrics in real time.
- **Operational Dashboard:** Track key business metrics, including approved medical costs and pet species distribution.
- **CSV Data Analysis:** Upload CSV files to calculate loss ratios and analyze metrics instantly without storing data.

---

## Tech Stack

- **Frontend:** React.js
- **Backend:** Python, FastAPI, SQLAlchemy(ORM)
- **Database:** PostgreSQL
- **Data Engine:** Pandas, NumPy
- **Version Control:** Git, GitHub

---

## Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL

### 2. Backend Setup
```bash
# Clone repository
git clone https://github.com/betty1225lee/pet-insurance-risk-analytics.git
cd pet-insurance-risk-analytics

# Set up virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload
```

### 2. Frontend Installation
```bash
# Open a new terminal tab, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm run dev
```