# PropertyPal

**Decentralized Real Estate Platform for Direct Buyer‑Seller Transactions**

## Table of Contents

1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Goals & Objectives](#goals--objectives)
4. [Target Users](#target-users)
5. [Features](#features)
6. [Tech Stack](#tech-stack)
7. [Project Structure](#project-structure)
8. [Installation & Local Setup](#installation--local-setup)
9. [Running the Application](#running-the-application)
10. [GitHub Repository Setup](#github-repository-setup)
11. [Future Enhancements](#future-enhancements)
12. [Contributors](#contributors)
13. [License](#license)

---

## Overview

PropertyPal is a modern **MERN** (MongoDB, Express.js, React.js, Node.js) full‑stack web application that connects buyers and renters directly with sellers and landlords, cutting out brokers and reducing fraud. The platform offers verified listings, AI/manual fraud detection, and a streamlined search and transaction experience.

## Problem Statement

Brokers often charge 5–15% of property value, inflate prices, and sometimes mislead clients. Buyers and renters waste time and money, while sellers struggle to reach genuine prospects. PropertyPal aims to eliminate these pain points.

## Goals & Objectives

* **Eliminate Intermediaries:** Enable direct buyer‑seller communication to save on brokerage fees.
* **Prevent Fraud:** Implement document uploads, verification workflows, and AI/manual checks.
* **Accelerate Discovery:** Offer advanced filters, sorting, and map integrations for faster property searches.
* **Build Trust:** Provide verified badges, ratings, reviews, and secure messaging.

## Target Users

* **First-Time Buyers:** Seeking affordable, transparent home purchases.
* **Renters:** Looking for reliable PGs/apartments without hidden fees.
* **Property Owners:** Wanting to sell or rent directly to maximize returns.
* **Admins:** Moderators managing verifications, listings, and user disputes.

## Features

* **Search & Filter:** Location, price, property type, verification status.
* **Sort Options:** By date added, price, popularity, or rating.
* **Notifications:** Updates on messages, listing status, and schedules.
* **Bookmarking:** Save and compare favorite properties.
* **Multi-Step Listing Forms:** Draft saving, image/doc uploads, progress indicators.
* **Real‑Time Chat & Scheduling:** In-app messaging and virtual tour bookings.
* **Admin Panel:** User management, listing approvals, fraud flags, data export.
* **Responsive Design:** Mobile‑first with Tailwind CSS.

## Tech Stack

* **Frontend:** React.js, React Router, Axios, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Databases:** MongoDB (listings), PostgreSQL (transactions)
* **Auth & Security:** JWT, bcrypt, CORS, rate‑limiting
* **APIs:** Mapbox/Google Maps, Cloudinary (media storage)
* **Deployment:** Vercel/Netlify (frontend), Render/Railway (backend)

## Project Structure

```
/client
  ├── public
  └── src
      ├── assets
      ├── components
      ├── context
      ├── hooks
      ├── layouts
      ├── pages
      ├── routes
      ├── utils
      ├── App.jsx
      ├── main.jsx
      └── index.css

/server
  ├── config
  ├── controllers
  ├── middleware
  ├── models
  ├── routes
  ├── utils
  └── server.js
```

## Installation & Local Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/PropertyPal.git
   cd PropertyPal
   ```
2. **Backend Setup**

   ```bash
   cd server
   npm install
   cp .env.example .env
   # Update .env with MongoDB URI, PostgreSQL URL, JWT_SECRET, etc.
   npm run dev
   ```
3. **Frontend Setup**

   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## Running the Application

* **API (Backend)**: [http://localhost:5000](http://localhost:5000)
* **UI (Frontend)**: [http://localhost:3000](http://localhost:3000)

## GitHub Repository Setup

1. **Create a new GitHub repo** named `PropertyPal`.
2. **Add remote** and push:

   ```bash
   git remote add origin https://github.com/<your-username>/PropertyPal.git
   git branch -M main
   git push -u origin main
   ```
3. **Setup CI/CD** (optional): Integrate GitHub Actions or connect Vercel/Netlify directly to `main` branch for automatic deployments.

## Future Enhancements

* **AI Fraud Detection**: Automated tamper detection for docs/images.
* **Rent Payment Gateway**: UPI/Razorpay integration.
* **Live Chat**: Socket.io or similar real‑time communication.
* **Legal Bot**: Auto-generate agreements with e-signatures.
* **Analytics Dashboard**: Price trends and market insights.


