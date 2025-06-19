# Student Progress Management System

This project is a **full-stack web application** for managing and tracking student progress on Codeforces. It provides a dashboard for administrators to view, add, edit, and delete students, monitor their contest and problem-solving activity, and send automated reminder emails to inactive students.

---

# Demo

https://github.com/user-attachments/assets/87f3bb51-9737-48cd-89ba-bec4d6f7c958

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Setup & Installation](#setup--installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Overview](#api-overview)
- [Cron Jobs & Automation](#cron-jobs--automation)
- [File/Folder Explanations](#filefolder-explanations)
- [Customization](#customization)


---

## Features

- **Student Management:** Add, edit, delete, and view students with Codeforces handles.
- **Progress Dashboard:** Visualize student ratings, solved problems, and contest history.
- **Automated Sync:** Periodically fetches latest Codeforces data for all students.
- **Reminder Emails:** Sends emails to students inactive for 7+ days.
- **Customizable Cron:** Admins can set the sync schedule via the dashboard.
- **Modern UI:** Built with React, TailwindCSS, and Recharts for interactive charts.

---

## Project Structure

```
SPW/
│
├── backend/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── controllers/
│   ├── cron/
│   ├── models/
│   ├── routes/
│   └── utils/
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   ├── api/
    │   ├── components/
    │   └── pages/
    └── public/
```

---

### Backend

- **server.js**: Entry point. Sets up Express server, connects to MongoDB, loads routes, and starts cron jobs.
- **.env**: Environment variables (MongoDB URI, etc).
- **controllers/**: Logic for handling API requests (students, sync settings).
- **cron/**: Scheduled jobs for syncing Codeforces data and sending reminder emails.
- **models/**: Mongoose schemas for `Student` and `SyncSettings`.
- **routes/**: Express route definitions for students and sync settings.
- **utils/**: Helper functions for syncing data, sending emails, and generating email templates.

### Frontend

- **package.json**: Frontend dependencies and scripts.
- **vite.config.js**: Vite configuration for React and TailwindCSS.
- **index.html**: Main HTML template for the app.
- **src/**
  - **App.jsx**: Main React component with routing.
  - **main.jsx**: Entry point, renders the app.
  - **index.css**: TailwindCSS import.
  - **api/**: Axios API calls to backend.
  - **components/**: Reusable UI components (modals, charts, forms).
  - **pages/**: Main pages (dashboard, student profile).
- **public/**: Static assets (favicon, manifest, etc).

---

## Setup & Installation

### Backend Setup

1. **Install dependencies:**
   ```sh
   cd backend
   npm install
   ```

2. **Configure environment:**
   - Edit `.env` with your MongoDB URI and other secrets.

3. **Start the server:**
   ```sh
   node server.js
   ```
   - The backend runs on port `5000` by default.

### Frontend Setup

1. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```sh
   npm run dev
   ```
   - The frontend runs on port `5173` by default (Vite).

---

## API Overview

- **Students**
  - `GET /api/students` — List all students.
  - `POST /api/students` — Add a new student.
  - `PUT /api/students/:id` — Update student.
  - `DELETE /api/students/:id` — Delete student.
  - `GET /api/students/:id` — Get student by ID.
  - `GET /api/students/:id/progress` — Get rating and submission history.
  - `GET /api/students/:id/contest-history?range=90` — Get contest history.
  - `GET /api/students/:id/problem-solving-stats?range=30` — Get problem stats.
  - `PUT /api/students/:id/toggle-reminder` — Toggle reminder emails.

- **Sync Settings**
  - `GET /api/sync/cron-time` — Get current cron schedule.
  - `POST /api/sync/update-cron` — Update cron schedule.

---

## Cron Jobs & Automation

- **Student Data Sync:**  
  The backend periodically fetches latest Codeforces data for all students using a cron job. The schedule is stored in the database and can be updated from the frontend.

- **Reminder Emails:**  
  Another cron job checks for students inactive for 7+ days and sends them a motivational email using the template in [`utils/emailTemplate.js`](backend/utils/emailTemplate.js).

---

## File/Folder Explanations

### Backend

- **controllers/**
  - `studentController.js`: Handles all student-related API logic.
  - `syncController.js`: Handles cron time retrieval and updates.
- **cron/**
  - `studentSyncCron.js`: Schedules and manages the student data sync job.
  - `emailCron.js`: Schedules and sends inactivity reminder emails.
- **models/**
  - `Student.js`: Mongoose schema for student data.
  - `SyncSettings.js`: Stores cron schedule for syncing.
- **routes/**
  - `studentRoutes.js`: API endpoints for student management.
  - `syncRoutes.js`: API endpoints for cron settings.
- **utils/**
  - `syncStudentData.js`: Fetches and updates student data from Codeforces.
  - `sendEmail.js`: Sends emails using Nodemailer.
  - `emailTemplate.js`: Generates HTML email content.

### Frontend

- **src/api/api.js**: All API calls to the backend.
- **src/components/**:  
  - `StudentForm.jsx`: Modal form for adding/editing students.
  - `DeleteConfirmModal.jsx`: Modal for confirming student deletion.
  - `StudentProgressModal.jsx`: Modal showing student progress charts.
  - `CronSettingsModal.jsx`: Modal for updating cron schedule.
  - `ProblemSolvingStats.jsx`: Displays problem-solving stats and heatmap.
  - `ContestHistory.jsx`: Displays contest history and rating graph.
  - `CustomHeatMap.jsx`: Custom heatmap component for activity.
  - `Dialog.jsx`: Reusable dialog/modal components.
- **src/pages/**
  - `StudentTablePage.jsx`: Main dashboard listing all students.
  - `StudentProfilePage.jsx`: Detailed profile for a single student.

---

## Customization

- **Change Email Sender:**  
  Update credentials in [`utils/sendEmail.js`](backend/utils/sendEmail.js).
- **Change Cron Defaults:**  
  Edit defaults in [`cron/studentSyncCron.js`](backend/cron/studentSyncCron.js) and [`cron/emailCron.js`](backend/cron/emailCron.js).

---

