
# Document Authorization App Summary

## Workflow Overview

The Document Authorization App facilitates document submission, verification, and authorization in a secure and efficient manner, leveraging blockchain technology for integrity and IPFS for storage. It supports multiple user roles, including independent users, admins, and organizations, each with specific capabilities and responsibilities.

## Modules and Entities

- **Auth Module:** Handles user authentication and authorization, including login, password management, and role-based access control.
- **User Module:** Manages user profiles, document submissions, and interactions with organizations for document verification.
- **Organization Module:** Enables organizations to verify documents, issue certificates, and manage submissions from users.
- **Document Module:** Manages document storage, submission, and verification status.
- **Notification Module:** Sends alerts and notifications to users regarding document status and other important updates.

## Roles and Responsibilities

- **Admins:**
  - Verify and approve user and organization registrations.
  - Manage user and organization roles and permissions.
  - Oversee the document verification process.
  - Handle platform management tasks, such as feedback review and system improvements.

- **Users:**
  - Register independently or be registered by admins.
  - Submit documents for verification.
  - Manage their documents, viewing statuses and receiving verifications.
  - Interact with organizations for document authentication and certification.

- **Organizations:**
  - Register on the platform and get verified by admins.
  - Verify and authenticate documents submitted by users.
  - Issue certificates and tokens for verified documents.
  - Manage submissions from users, including approval or rejection.

## Entities and Relations

- **User:** Stores user information, including authentication credentials, role IDs, and personal details.
- **Organization:** Contains organization details, role IDs, and verification status.
- **Document:** Represents documents submitted by users, including hash, status, and ownership information.
- **Certificate:** Links documents to tokens or certificates issued by organizations.
- **Role & Permission:** Define access control for users and organizations, including specific actions allowed on the platform.

## Implementation Details

- **Database:** PostgreSQL, leveraging TypeORM for object-relational mapping.
- **Backend:** Nest.js framework, adopting a clean architecture with a repository pattern for database interactions and JWT for role-based authentication.
- **Blockchain:** Ethereum for document verification and token issuance, with smart contracts written in Solidity.
- **File Storage:** IPFS for decentralized document storage, ensuring data integrity and availability.

This document outlines the high-level structure and functionality of the Document Authorization App, providing a foundation for development and implementation.
