
# Document Authorization Application Design Document

## Table of Contents

- [Overview](#overview)
- [Authentication and User Management](#authentication-and-user-management)
- [Document and Certificate Management](#document-and-certificate-management)
- [Entities and Their Relations](#entities-and-their-relations)
- [Modules and Functionalities](#modules-and-functionalities)
- [Roles and Responsibilities](#roles-and-responsibilities)
- [Technology Stack](#technology-stack)

## Overview

This application facilitates secure document and certificate authorization utilizing blockchain technology. It features role-based access for administrators, users, and organizations, ensuring secure and verifiable document transactions.

## Authentication and User Management

### Workflow

- **Users** can register independently or be created by admins, submitting documents for verification.
- **Admins** verify users and organizations, manage roles, and have the authority to revoke access.
- **Organizations** can create users within their domain to authorize documents and manage certificates.

### Authentication Flow

1. User registration with document submission.
2. Admin verification and role assignment.
3. User and organization authentication for platform access.

## Document and Certificate Management

- **Users** submit documents for organization authentication and request certificates.
- **Organizations** verify documents, issue authentication tokens, and generate digital certificates.

## Entities and Their Relations

### Users

- **Attributes**: ID, email, password, roles, personal details, Ethereum address.
- **Relations**: Can own documents and request certificates.

### Organizations

- Similar attributes to users, with additional fields for organizational details.
- **Relations**: Authenticate documents, issue certificates, manage users.

### Documents and Certificates

- **Documents**: ID, hash, originality status, authentication token, and more.
- **Certificates**: Link to authenticated documents with issued tokens.

### Additional Entities

- **Roles, Permissions**: Define user and organization capabilities.
- **Notifications**: Inform about document and certificate status updates.

## Modules and Functionalities

- **Auth Module**: Handles comprehensive authentication mechanisms.
- **User Module**: Manages user interactions with documents and certificates.
- **Organization Module**: Dedicated to organization-level document management and user oversight.
- **Document and Certificate Modules**: Focus on the lifecycle of documents and certificates respectively.
- **Notification Module**: Manages communication with users and organizations.

## Roles and Responsibilities

- **Admins**: Oversee platform integrity, user verification, and access management.
- **Users**: Engage in document submission and certificate requests.
- **Organizations**: Authenticate user documents and manage organizational certificates.
- **Organization Users**: Operate under organizations for specific document management tasks.

## Technology Stack

- **Blockchain**: Ethereum, Solidity, Truffle Suite, Ganache, IPFS.
- **Frontend**: Angular with NGXS for state management.
- **Backend**: Nest.js with PostgreSQL, implementing clean architecture and JWT authentication.

---

This document outlines the foundation of a document authorization application, setting the stage for secure and efficient document handling and verification processes.
