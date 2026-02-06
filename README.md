# UrbanMind 🌱
### A Digital Platform for Social Welfare, Donations, and Community Trust

**UrbanMind** is a full-stack web platform designed to connect Citizens, Volunteers, NGOs, and Administrators in a transparent and secure ecosystem. The platform simplifies complaint reporting, donation management, and real-time collaboration to solve civic issues.

---

## 🎯 The Problem
* **Lack of Transparency:** Difficulty in tracking where donations and complaints go.
* **Verification Gaps:** No centralized system to verify the authenticity of NGOs or volunteers.
* **Delayed Action:** Communication silos between reporters and problem solvers.

## 💡 The Solution
* **Civic Reporting:** Citizens report issues (potholes, waste, etc.) which are then verified and assigned.
* **Trust Ecosystem:** Administrative workflow to approve/reject NGO and Volunteer credentials.
* **Real-Time Synergy:** Integrated chat and notification systems for immediate updates.
* **Secure Funding:** Transparent donation tracking with goal-based project funding.

---

## 🧱 Technical Architecture
The system is built using a **Microservices Architecture** for high scalability and resilience.

* **Frontend:** React.js (Tailwind CSS, Context API)
* **Backend:** Spring Boot 3.x (Spring Cloud, Spring Security)
* **Database:** PostgreSQL (Unified urbanmind schema)
* **Service Discovery:** Netflix Eureka
* **API Gateway:** Spring Cloud Gateway (Single Entry Point)
* **Auth:** Stateless JWT-based Authentication
* **Real-time:** WebSockets (STOMP) & Socket.io

---

## 👥 User Roles & Workflows

### 🏛️ Admin
* **Moderation:** Review and verify NGO/Volunteer applications.
* **Management:** Oversee platform activity and user roles.
* **Security:** Monitor system health via Dashboard.

### 👤 Citizen (Reporter/Donor)
* **Report:** Log civic problems with media attachments.
* **Donate:** Fund specific projects to resolve reported issues.
* **Track:** Real-time status updates on personal reports.

### 🤝 Volunteer / NGO
* **Verification:** Submit documents (ID/Certification) for approval.
* **Action:** "Pick Up" unassigned problems and coordinate solutions.
* **Resolution:** Update project milestones and mark problems as "Resolved."

---

## 🔐 Security Features
* **Stateless Auth:** JWT tokens for secure, scalable session management.
* **RBAC:** Role-Based Access Control at both Gateway and Service levels.
* **Data Safety:** Validation at controller and service layers; SQL injection protection via JPA.

---

## 📂 Project Structure (Microservices)

Urbanmind-Project/
├── urbanmind-gateway/       # Port 9000 (Entry point)
├── eurekaserver/            # Port 8761 (Registry)
├── urbanmind-auth/          # Core Business & User Identity
├── UrbanChats/              # Real-time WebSocket Messaging
├── donation-service/        # Payment & Notification Hub
└── urbanmind-frontend/      # React Application

🚀 How to Run
Prerequisites
JDK 17+

Node.js 18+

PostgreSQL

Maven

Installation
Clone the repository:
git clone [https://github.com/vibhutichou/UrbanMind.git](https://github.com/vibhutichou/UrbanMind.git)
cd urbanmind
Start Infrastructure:

Run EurekaServerApplication (Port 8761).

Run GatewayApplication (Port 9000).

Start Services:

Run Auth, Chat, and Donation services using mvn spring-boot:run.

Start Frontend:
cd urbanmind-frontend
npm install
npm start

👩‍💻 Author
Vibhuti Choudhary
CDAC Project | Full-Stack Java Developer