# Engineering & Computer Science Concepts Learned & Implemented

This document lists the technical, architectural, and design patterns implemented in the **Hostel Help** project. Use this list to prepare for technical interviews and describe your expertise.

---

## ⚛️ React (Frontend Engineering)

*   **Global State Management & Context API:**
    *   *Implementation:* Developed `AuthContext` and `NotificationContext`.
    *   *Concept:* Managed global application states (user authentication, active session tokens, real-time message lists) and broadcasted them across deeply nested components without "prop-drilling."
*   **Component Lifecycles & Side-Effect Synchronization:**
    *   *Implementation:* Used `useEffect` hooks for API fetching and managing WebSocket lifecycles.
    *   *Concept:* Synchronized frontend rendering with external networks. Handled resource cleanup by closing WebSocket connections when the user logs out to prevent memory leaks.
*   **Client-Side Client/Server Communication (STOMP WebSockets):**
    *   *Implementation:* Integrated `@stomp/stompjs` client.
    *   *Concept:* Established full-duplex communication over raw TCP-like channels. Subscribed to user-specific message queues (`/user/queue/notifications`) for real-time data push.
*   **Client-Side Routing & Route Protection:**
    *   *Implementation:* Configured React Router routes.
    *   *Concept:* Created custom route guards (Higher-Order Components) to validate user authentication and roles (Student, Warden, Admin) before rendering dashboards, preventing unauthorized path access.
*   **Client-Side Heuristics (NLP Priority Tagging):**
    *   *Implementation:* Real-time title analysis using pattern keyword matching.
    *   *Concept:* Dynamic user-interface responsiveness. Used a rule-based algorithm on form input fields to forecast issue priority level immediately as the user type.
*   **Custom Modular Theme Systems:**
    *   *Implementation:* Centralized `theme.js` configurations.
    *   *Concept:* Created a design system of variables (colors, box-shadows, borders, transitions) to maintain visual consistency across all pages and layouts.

---

## 🍃 Spring Boot (Backend & REST API Architecture)

*   **Model-View-Controller (MVC) Architecture:**
    *   *Implementation:* Decoupled controllers, services, repositories, and models.
    *   *Concept:* separation of concerns. Presentation logic is managed in controllers, business operations are encapsulated inside service classes, and data access is isolated in repositories.
*   **Stateless Cryptographic Authentication (JWT & Spring Security):**
    *   *Implementation:* Configured filter chains and token interceptors.
    *   *Concept:* Decentralized sessions. Extracted, parsed, and cryptographically verified JSON Web Tokens (JWT) from client requests to populate the Security Context for role-based authorization.
*   **Asynchronous Non-Blocking Execution:**
    *   *Implementation:* Used `@Async` and `@EnableAsync`.
    *   *Concept:* Multithreading. Delegated heavy, external tasks (like compiling email layouts and sending them) to a background thread pool executor so that client HTTP response times remain sub-second.
*   **Real-time WebSocket Message Brokerage:**
    *   *Implementation:* Configured `/ws` endpoint with a simple message broker.
    *   *Concept:* Client-server messaging architectures. Allowed targeted messaging through private queues `/queue/notifications` mapped to distinct Spring Security user identities.
*   **REST Client Communication:**
    *   *Implementation:* Utilized `RestTemplate` for Brevo REST API endpoints.
    *   *Concept:* Microservice interaction. Composed complex HTTP entities (headers, content-types, payload objects) and managed REST API transactions with third-party servers.
*   **Global Exception Handling & Error Mapping:**
    *   *Implementation:* Configured `@ControllerAdvice` and custom exceptions.
    *   *Concept:* Unified error response patterns. Prevented stack trace exposure to clients by catching execution failures globally and translating them into standardized HTTP response codes and clean JSON bodies.

---

## 🐬 MySQL (Relational Database Design)

*   **Object-Relational Mapping (ORM):**
    *   *Implementation:* Hibernate JPA annotations (`@Entity`, `@Table`, `@Id`).
    *   *Concept:* Mapping object-oriented domain models to relational tables, letting JPA handle translation without manual SQL query writing.
*   **Relational Database Normalization & Relationships:**
    *   *Implementation:* Defined `@ManyToOne` and `@OneToMany` annotations.
    *   *Concept:* Preserving relational integrity. Enforced database-level relationships (e.g. mapping many complaints to one user) and configured cascade styles to prevent orphaned data records.
*   **ACID Compliance & Transaction Management:**
    *   *Implementation:* Enforced relational constraints and automatic transaction support in JPA.
    *   *Concept:* Ensuring database actions are atomic, consistent, isolated, and durable (ACID) during multi-step changes.
*   **Database Schema Migration:**
    *   *Implementation:* Used `spring.jpa.hibernate.ddl-auto=update`.
    *   *Concept:* Synchronized schema evolution, ensuring database tables update safely at application startup based on class field modifications.

---

## 🌐 Overall Project System Architecture

*   **Cross-Origin Resource Sharing (CORS):**
    *   *Concept:* Configured web security filters to authorize only specific client origins (e.g., Netlify production domains) to communicate with API endpoints, protecting the API from malicious browser requests.
*   **API Contract Design:**
    *   *Concept:* Defined clean JSON-based request and response schemas (DTOs) ensuring decoupled frontend/backend changes.
*   **Production Environment Adaptability:**
    *   *Concept:* Configured fallback patterns (SMTP mail relay vs. REST HTTPS APIs) based on environment flags, resolving cloud host network constraints.
