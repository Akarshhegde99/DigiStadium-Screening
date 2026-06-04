# 🏏 Internship Project Report: Harvey's Cafe - IPL Match Booking System

**Project Type:** Full-Stack Web Application  
**Purpose:** Internship Diary / Final Project Documentation  

---

## 1. Abstract & Executive Summary
During the internship period, I developed the **Harvey's Cafe IPL Table Booking System**, a comprehensive full-stack web application. The primary objective was to digitize and streamline the table reservation process for cricket fans visiting Harvey's Cafe during the Indian Premier League (IPL) season. The application replaces manual, chaotic table management with an automated, secure, and user-friendly digital platform. Key highlights include real-time table availability tracking, secure payment gateway integration via Stripe, stateful JWT authentication, and automated QR code-based digital ticketing.

---

## 2. Problem Statement & Objectives
During peak IPL match days, Harvey's Cafe faced significant operational challenges:
- **Overbooking and Clashes:** Manual reservation logs led to duplicate bookings for the same tables.
- **Ticketing Inefficiency:** Lack of a streamlined entry verification process.
- **Payment Handling:** Difficulty in managing advance payments and high cancellation rates.

**Project Objectives:**
1. Build an intuitive web platform for fans to book tables for specific IPL matches.
2. Ensure automated, conflict-free table reservations using advanced database validations.
3. Introduce digital tickets (QR Codes) to streamline point-of-entry verification at the cafe.
4. Implement secure online transactions for advance booking and token generation.

---

## 3. Technology Stack & Architecture
The system adopts a modern 3-tier architecture separating the presentation, business logic, and data storage layers.

### 3.1 Frontend (Presentation Layer)
- **Framework:** React.js powered by Vite for rapid development and enhanced performance.
- **Styling:** Tailwind CSS for building a highly responsive, modern, and aesthetically pleasing User Interface (UI).
- **Routing:** React Router DOM (Single Page Application navigation).
- **Integrations:**
  - `axios` for backend communication.
  - `@stripe/react-stripe-js` & `@stripe/stripe-js` for PCI-compliant payment UI.
  - `qrcode.react` to render digital tickets dynamically.
  - `lucide-react` for consistent iconography.

### 3.2 Backend (Business Logic Layer)
- **Framework:** Spring Boot (Java 17) ensuring robust, scalable, and enterprise-grade REST APIs.
- **Security:** Spring Security integrated with **JWT (JSON Web Tokens)** for stateless, secure user authentication.
- **ORM:** Spring Data JPA (Hibernate) for Object-Relational Mapping.
- **Integrations:**
  - `stripe-java` for secure, server-side Stripe Payment Intent generation.
  - `zxing (Zebra Crossing)` core/javase for server-side QR Code string encoding.
  - `lombok` for reducing boilerplate Java code.

### 3.3 Database Layer
- **Development Phase:** H2 In-Memory Database for rapid prototyping and testing.
- **Production Phase:** MySQL relational database for persistent, structured data storage and ACID compliance.

---

## 4. Comprehensive Development Journey (From Scratch to Deployment)

The project was executed in structured phases, reflecting a standard Software Development Life Cycle (SDLC).

### Phase 1: Planning and System Design 
- **Requirement Analysis:** Defined the core entities (Users, Matches, Tables, Bookings) and their relationships.
- **UI/UX Design:** Wireframed the essential screens (Login/Register, Match Listing, Seat Layout, Payment Checkout, Final Ticket).
- **Stack Selection:** Chose a highly-interactive React frontend with a secure Spring Boot backend for maximum scalability.

### Phase 2: Backend Development & API Engineering 
- **Initialization:** Bootstrapped the Spring Boot application using Maven.
- **Security Implementation:** Configured **Spring Security** to restrict specific endpoints. Implemented custom JWT filters to authenticate requests via the `Authorization` header.
- **RESTful Endpoints:** 
  - `/api/auth/*` for user registration and login.
  - `/api/matches/*` to fetch active matches and handle "Coming Soon" statuses.
  - `/api/bookings/*` to reserve tables and prevent double bookings.
- **Business Logic Implementation:** Wrote logic to ensure users could not book a table that was already marked as reserved for a specific match.

### Phase 3: Frontend Interface & State Management 
- **Initialization:** Created the React app using Vite (`npm create vite@latest`).
- **Styling:** Set up **Tailwind CSS** for clean, responsive component styling, achieving a premium dark/vibrant aesthetic suitable for an IPL theme.
- **State Management:** Utilized React Context API and hooks (`useState`, `useEffect`) to manage user sessions and booking progress.
- **Component Engineering:** Built reusable UI components (Match Cards, Table Grids, Modals).

### Phase 4: Database Migration & Persistent Storage
- **Migration Strategy:** Transitioned the backend data source from an ephemeral **H2 in-memory database** to a permanent **MySQL** database.
- **Configuration:** Refactored `application.properties` to connect to local MySQL instances during development, injecting environment variables for security.
- **JPA Updates:** Updated entity mappings and generation strategies to align with MySQL dialect.

### Phase 5: Payment & Utility Integration
- **Stripe Integration (Backend):** Created a service to generate Stripe "PaymentIntents" representing the cost of the table booking.
- **Stripe Integration (Frontend):** Connected the frontend Stripe Elements UI to consume the `client_secret` from the backend, allowing users to embed credit card details securely.
- **QR Code Generation:** Integrated `qrcode.react` (Frontend) and `ZXing` (Backend) to generate unique QR codes encapsulating the Booking Reference ID and Match details.

### Phase 6: Cloud Deployment & DevOps
The application was transitioned from `localhost` to a live cloud-native production environment:
1. **Database Layer (Railway):**
   - Provisioned a managed, highly-available MySQL database instance.
   - Secured credentials and exposed the connection string via `MYSQL_URL`.
2. **Backend Service (Render):**
   - Packaged the Spring Boot application into a `.jar` artefact (`mvnw clean package`).
   - Deployed a web service on Render, configuring crucial environment variables (`JWT_SECRET`, `STRIPE_API_KEY`, `DB_URL`) securely in the Render dashboard.
3. **Frontend App (Vercel):**
   - Linked the GitHub repository to Vercel for CI/CD continuous deployment.
   - Connected the Vercel app to the Render Live API using `VITE_API_URL` ensuring the frontend talks to the production backend.

---

## 5. Core Modules & Features Developed

1. **User Authentication & Authorization Module:**
   - Secure Login/Sign-up with encrypted passwords (BCrypt).
   - JWT token-based session verification ensuring secure API requests.
2. **Dynamic Match & Event Display:**
   - Real-time fetching of upcoming matches.
   - Clickable match posters for active booking windows, and stylized "Coming Soon" overlays for future fixtures.
3. **Interactive Table Selection Engine:**
   - Visual map of available vs. booked tables.
   - Concurrency control: Backend validation explicitly checking if `status == "BOOKED"` before committing to prevent race conditions.
4. **Checkout & Payment Gateway:**
   - End-to-end checkout experience with Stripe.
   - **Fail-safe mechanism:** If a payment fails or is marked pending, the system allows the user to hold the reservation as "Pay at Cafe" instead of outright rejecting the booking.
5. **Digital Ticketing Hub:**
   - Upon successful booking, users receive an auto-generated digital ticket.
   - Contains a unique QR code allowing the cafe manager to swiftly scan and allocate the assigned table.

---

## 6. Technical Challenges Faced & Resolutions

- **Challenge:** *Cross-Origin Resource Sharing (CORS) & Routing issues post-deployment.*
  - **Resolution:** Configured global CORS policies in Spring Boot `WebMvcConfigurer` to explicitly allow Vercel origins. Resolved frontend routing glitches (404 on refresh) by configuring `vercel.json` to rewrite all routes to `index.html`.
- **Challenge:** *Strict Dependency Conflicts in React.*
  - **Resolution:** Cleaned up incompatible dependencies around ESLint and Vite plugins. Enforced strict package versions in `package.json` to stabilize the build environment.
- **Challenge:** *Database Schema Migration complexities.*
  - **Resolution:** Carefully modified Spring Data JPA `@Entity` relationships and data types to prevent dialect conflicts when shifting from H2 to MySQL. 
- **Challenge:** *Handling incomplete financial transactions.*
  - **Resolution:** Engineered a multi-state booking workflow (`PENDING`, `CONFIRMED`, `FAILED`) to ensure application durability and better user experience even when banking gateways timed out.

---

## 7. Conclusion & Future Scope

The **IPL Harvey's Cafe Booking App** proved to be an intensive, rewarding full-stack development journey simulating real-world engineering standards. The project successfully bridged the gap between modern web technologies (React/Spring Boot) and critical business constraints (real-time concurrency, secure payments, and distributed deployments). 

**Future Enhancements planned:**
- Integrating WebSocket for real-time live match score updates directly on the dashboard.
- Introducing a dedicated "Admin Dashboard" for cafe managers to scan QR codes and update table statuses in real-time.
- Implementing an automated email notification system (via JavaMailSender) sending booking confirmations to users.

---
*End of Report*
