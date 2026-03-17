# ThreatView

A Tiered Threat Intelligence Dashboard for Small to Medium-sized Businesses (SMBs).
ThreatView acts as a central nervous system for threat data, aggregating noisy data from sources like AlienVault OTX and PhishTank, normalizing it, and presenting it through a modern, premium web interface.

## Features

- **Ingestion Engine**: A robust Node.js ETL pipeline using `node-cron` to continuously fetch and normalize threat indicators.
- **Threat Dashboard**: A sleek, dark-mode focused React frontend showcasing a Live Threat Map (via `react-simple-maps`) and malware trends (via `recharts`).
- **IoC Search**: Easily search for suspected IPs, domains, URLs, or file hashes.
- **Alert Logic Engine**: Configure standing custom alerts (e.g., matching a Brand Domain or Specific IP) to trigger when matched against newly ingested threats.
- **PDF Reporting & RBAC**: Tiered access. "Pro" tier unlocks historical searching and downloadable weekly PDF reports generated server-side using Puppeteer.

## Tech Stack

- **Frontend**: React (Vite), React Router, Axios, Recharts, React-Simple-Maps, Lucide Icons. Pure vanilla CSS glassmorphism.
- **Backend**: Node.js, Express, node-cron, Puppeteer.
- **Database**: MongoDB (Mongoose ORM).
- **Authentication**: JWT, bcryptjs.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running locally on port 27017

### Installation

1. Clone the repository
2. Install dependencies for both `backend` and `frontend`:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

### Running the Services

Open two terminal tabs.

**Backend Terminal:**
```bash
cd backend
npm run dev
```
*(The backend runs on http://localhost:5001)*

**Frontend Terminal:**
```bash
cd frontend
npm run dev
```
*(The frontend runs on http://localhost:5174)*

Navigate to `http://localhost:5174` in your browser. Register a test account and explore the dashboard!
