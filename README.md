# Hostel Help 🏢

Hostel Help is an enterprise-grade, full-stack digital grievance management system designed to automate, track, and streamline issue reporting and resolution in student residential housing. It replaces slow, manual paper-based reporting with a structured, real-time collaboration workflow between **Students**, **Coordinators (Administrators)**, and **Maintenance Staff (Wardens)**.
 LIVE DEMO - [https://hostelhelps.netlify.app/]
---

## 🌟 Key Product Features

### 1. Secure Role-Based Dashboards (RBAC)
*   **Students:** Raise and track issues, update profiles, view detailed resolution timelines, and search a self-help knowledge base.
*   **Wardens:** Manage a focused task list, update task statuses (In Progress, Resolved, Rejected), and submit repair/resolution remarks.
*   **Administrators:** Central command center to view all active complaints across campus, manage user accounts and approval queues, modify dynamic complaint categories, and view analytics.

### 2. Intelligent Auto-Priority Classification
*   Includes a real-time natural language keyword analyzer on the complaint form. 
*   Instantly categorizes complaints into **High**, **Medium**, or **Low** priority based on the words typed in the title (e.g. automatically identifying terms like "shock", "leakage", or "fire" as High-Priority).

### 3. Smart Workload Allocation
*   Allows coordinators to see warden availability and active ticket counts.
*   Enables efficient ticket dispatching to wardens specializing in specific domains (e.g. plumbing, electrical, carpentry).

### 4. Interactive Resolution Timeline
*   Tracks complaints through their entire lifecycle.
*   Students can see chronological updates showing when the ticket was received, when work was started, who is assigned, and closing remarks.

### 5. Multi-Channel Alerting (WebSockets + Email)
*   **Real-time Push Alerts:** Uses WebSocket communication (STOMP protocol) to deliver instant pop-up alerts on active user dashboards when status changes occur.
*   **Offline Transactional Email Notifications:** Dynamically dispatches elegant HTML status emails to users to keep them informed when they are offline.
*   **Dual-mode Email Routing:** Configured to automatically switch between standard SMTP (development/local) and secure HTTPS REST API calls (via Brevo) to bypass server-level SMTP port blocks in production environments like Render.

### 6. Interactive Performance Analytics
*   Provides administrators with interactive charts showing average response times, category-wise issue distribution, and warden resolution rates.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework:** React.js
*   **Styling:** Modern, responsive custom design theme (using rich variables, cards, grids, and glassmorphism elements)
*   **Icons:** Lucide React
*   **Alerts:** React Toastify
*   **Real-time Networking:** `@stomp/stompjs` (STOMP WebSockets client)

### Backend
*   **Core Engine:** Spring Boot (Java 21/25)
*   **Data Layer:** Spring Data JPA
*   **Database:** MySQL
*   **Security:** Stateless JWT Authentication & Role-Based Authorization
*   **Email Deliverability:** Spring Mail Sender & Brevo Transactional REST Client

---

## 🔄 End-to-End Workflow

```
[Student Logs In]
        │
        ▼
[Submits Complaint Form] ──► (Real-Time Auto Priority Tagging)
        │
        ▼
[PENDING Status] 
        │
        ▼
[Admin Central Control Panel] ──► (Triage & Workload-Aware Assign)
        │
        ▼
[ASSIGNED Status] ──► (Warden receives Toast Alert & Offline HTML Email)
        │
        ▼
[Warden Accepts Ticket] ──► (Status changes to IN PROGRESS ──► Student notified)
        │
        ▼
[Resolution Cycle Completed] 
        │
        ├─► [RESOLVED] + Remarks ──► Student gets final completion notification
        └─► [REJECTED] + Reasons ──► Student gets rejection explanation
```

---

## ⚙️ Environment Configuration

To configure the application for local development or production, define the following variables:

### Database Settings
*   `SPRING_DATASOURCE_URL`: The JDBC URL for your MySQL instance.
*   `SPRING_DATASOURCE_USERNAME`: Database username.
*   `SPRING_DATASOURCE_PASSWORD`: Database password.

### Security Settings
*   `JWT_SECRET`: A secure, secret key used for signing JWT authentication tokens.
*   `JWT_EXPIRATION`: Token validity duration in milliseconds.

### Email Configuration (Standard SMTP)
*   `SPRING_MAIL_HOST`: SMTP host server (e.g., `smtp.gmail.com`).
*   `SPRING_MAIL_PORT`: SMTP server port (e.g., `465` or `587`).
*   `SPRING_MAIL_USERNAME`: SMTP login username.
*   `SPRING_MAIL_PASSWORD`: SMTP app-specific password.

### Outbound HTTP API Configuration (Production / Render SMTP Bypass)
To bypass cloud hosting port blocks (like on Render), configure these properties:
*   `BREVO_API_KEY`: Your Brevo REST API v3 Key (starts with `xkeysib-`). Disables standard SMTP and routes emails over HTTPS (port 443).
*   `BREVO_SENDER_EMAIL`: The verified sender email registered in your Brevo account (used as the outbound sender).

---

## 🚀 Getting Started

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Run the application: `./mvnw spring-boot:run`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
