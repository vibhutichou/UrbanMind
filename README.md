UrbanMind 🌱

A Digital Platform for Social Welfare, Donations, and Community Trust

📌 Project Overview

UrbanMind is a full-stack web platform designed to connect donors, volunteers, NGOs, and administrators in a transparent and secure ecosystem.
The platform simplifies donation management, user verification, and real-time notifications, ensuring trust, accountability, and smooth collaboration.

This project was developed as part of a CDAC academic project, focusing on real-world system design, RESTful APIs, and role-based access control.

🎯 Problem  

Lack of transparency in donation platforms

No centralized verification for NGOs and volunteers

Poor tracking of donation history

Limited real-time communication between users


💡 Solution

UrbanMind solves these problems by providing:

Verified user ecosystem (Admins approve/reject requests)

Secure donation tracking with history

Role-based dashboards

Notification system for real-time updates

Scalable backend architecture


🧱 System Architecture

Frontend: React (Role-based UI)

Backend: Spring Boot (REST APIs)

Database: MySQL

Authentication: JWT-based authentication

Communication: REST + Notifications

Architecture Style: Layered (Controller → Service → Repository)


👥 User Roles

Admin

Verify NGOs & volunteers

Approve or reject requests

Monitor platform activity

Donor

Make donations

View donation history

Receive notifications

Volunteer / NGO

Submit verification request


Access role-specific features after approval

✨ Key Features

🔐 JWT Authentication & Authorization

✅ Admin-controlled verification workflow

💸 Donation management with history

🔔 Notification system

📊 Role-based dashboards

🌐 RESTful API design

🔄 Verification Workflow


User submits verification request

Admin reviews details

Admin approves or rejects

System updates user role and status

Notification sent to user


🧪 API Highlights

User authentication APIs

Verification request APIs

Donation APIs

Notification APIs

All APIs follow REST principles with proper HTTP status codes.


🔐 Security

JWT tokens for stateless authentication

Role-based access control

Protected admin endpoints

Validation at controller and service layers


📂 Project Structure (Backend)
controller/
service/
repository/
dto/
entity/
exception/
config/


🚀 How to Run the Project
Backend
mvn clean install
mvn spring-boot:run

Frontend
npm install
npm start


🧠 What I Learned ?

Designing RESTful APIs

JWT authentication & authorization

Spring Boot layered architecture

Role-based access control

Real-world Git workflow

Debugging production-level issues


📌 Future Enhancements

Payment gateway integration

Analytics dashboard

Email & SMS notifications

Cloud deployment


👩‍💻 Author

Vibhuti Choudhary
CDAC Project | Full-Stack Java Developer