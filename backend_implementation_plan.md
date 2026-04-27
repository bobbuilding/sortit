# SortIT: Backend Implementation & Engineering Plan

This document outlines the technical strategy for transitioning the SortIT MVP from mock data to a production-grade, highly-available financial backend.

## 🏛️ Architectural Standards

To maintain institutional-grade reliability, the backend must adhere to the following:

1. **ACID Compliance**: All financial mutations (Ledger entries, Vault swaps) must be wrapped in ACID-compliant transactions using SQLAlchemy's `session.begin()`.
2. **Stateless Scalability**: Using FastAPI for asynchronous performance with JWT-based Bearer token authentication.
3. **Double-Entry Awareness**: Every "Allocation" or "Trade" must have a documented source and sink to ensure system-wide balance integrity.
4. **Validation Layer**: Strict Pydantic v2 schemas for all request/response bodies to prevent malformed data ingestion.

---

## 🚄 Implementation Tracks (Parallel)

### Track A: Core Infrastructure & Security (Dev 1)
*Focus: Identity, Data Integrity, and the Ledger Truth.*

| Phase | Task | Details |
| :--- | :--- | :--- |
| **A1** | **Auth Architecture** | JWT Implementation, Password Hashing (Argon2/Bcrypt), and Role-Based Access Control (RBAC). |
| **A2** | **Migration Strategy** | Setup `Alembic` for database versioning to prevent data loss during schema evolution. |
| **A3** | **Transaction Engine** | Implement the core `POST /ledger` logic with strict balance checks (cannot spend what isn't allocated). |
| **A4** | **Audit Logging** | Immutable log of all system mutations for compliance and security forensics. |

### Track B: Terminal API & Analytics (Dev 2)
*Focus: Dashboard Performance, Real-time Feeds, and UI Integration.*

| Phase | Task | Details |
| :--- | :--- | :--- |
| **B1** | **Analytics Engine** | Aggregation pipelines for NAV (Net Asset Value), Burn Rate, and Runway calculations. |
| **B2** | **Node Topology** | API for managing Distributed Nodes (TREASURY, VAULT, LEDGER) and their health states. |
| **B3** | **Market Data Mocking** | Setup background tasks for simulating "Live Feed" price updates for assets. |
| **B4** | **CORS & Integration** | Finalize API middleware to allow secure communication with the Next.js frontend. |

---

## 🗺️ Frontend-to-Backend Dependency Mapping

| UI Feature | Endpoint | Dependency | Track |
| :--- | :--- | :--- | :--- |
| **User Onboarding** | `POST /api/v1/auth/signup` | Form fields in `/onboarding` | Track A |
| **Dashboard Metrics** | `GET /api/v1/dashboard/stats` | Mock data in `lib/mockData.ts` | Track B |
| **New Allocation** | `POST /api/v1/assets/allocate` | `AllocationModal` inputs | Track B |
| **Security Vault** | `GET /api/v1/vault/keys` | Vault state management | Track A |
| **Portfolio Matrix** | `GET /api/v1/portfolio/live` | Time-series data format | Track B |

---

## 🛠️ Tech Stack & Environment

- **Language**: Python 3.10+
- **Framework**: FastAPI
- **ORM**: SQLAlchemy 2.0 (Async)
- **Database**: PostgreSQL (Production) / SQLite (Local Dev)
- **Migrations**: Alembic
- **Security**: PyJWT + Passlib

## 🚀 Execution Strategy

1. **Step 1**: Dev 1 initializes the shared `models.py` and `database.py` foundations.
2. **Step 2**: Dev 2 creates mock API responses based on agreed Pydantic schemas so the Frontend can stay "hot."
3. **Step 3**: Both tracks proceed independently, merging via Pull Requests (PRs) into the `main` development branch.
