# Security Hardening - Infinite Station

This document outlines the security measures implemented to protect client data, specifically ERP and Marketplace OAuth tokens.

## 1. OAuth Encryption (AES-256-GCM)
All integration tokens (Tiny, Bling, Mercado Livre) are encrypted before being persisted to the database.

- **Algorithm**: AES-256-GCM
- **Key Management**: Primary encryption keys are stored in environment variables (`ENCRYPTION_SECRET`), which should be managed via a Secret Manager (e.g., AWS Secrets Manager, GCP Secret Manager) in production.
- **Initialization Vector (IV)**: A unique IV is generated for every encryption operation and stored alongside the ciphertext.

## 2. API Security
- **NextAuth.js**: All dashboard routes are protected by session-based authentication.
- **Middleware**: `src/middleware.ts` enforces authentication checks and RBAC levels before rendering components or executing server actions.
- **TLS 1.3**: Production environments are configured to require TLS 1.3 for all incoming traffic.

## 3. RBAC (Role-Based Access Control)
Infinite Station implements a tiered access model:
- **Admin**: Full access to settings, integrations, and financial data.
- **Analyst**: Access to dashboards, alerts, and product management. Cannot view sensitive financial global settings.
- **Viewer**: Read-only access to sales charts and inventory status.

## 4. Audit Trail
All security-critical actions (token rotation, user invites, price override) are recorded in the immutable Audit Log accessible at `/settings/audit`.
Logs include:
- Timestamp
- Subject (User/IA)
- Action
- IP Address & User Agent
