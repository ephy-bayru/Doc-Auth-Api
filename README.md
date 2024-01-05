
# Blockchain-based Document and Certificate Authorization App

## Project Overview

This application leverages blockchain technology to provide a secure and efficient platform for document and certificate authorization. It's designed for users and organizations to manage digital certificates and documents with ease. The project is developed using NestJS, employing its robust capabilities to build scalable server-side applications.

## Key Features

### Admin Functionalities

- Create and register users and organizations.
- Assign and revoke user roles.

### User Functionalities

- Secure login and account management.
- Password reset and recovery options.
- Role-based access to different app features.
- Capability to acquire digital certifications with organizational tokens.
- Uploading and managing documents via IPFS.
- Requesting document authentication and receiving notifications.

### Organization Functionalities

- Account management with secure login features.
- Issuing digital certificates with tokens.
- Document authentication and token management.
- Verification of documents authenticated by other organizations.

## Technology Stack

### Blockchain

- Ethereum
- Solidity
- Truffle Suite
- Ganache
- IPFS (InterPlanetary File System)

### Frontend

- Angular with NGXS for state management.

### Backend

- NestJS with Node.js
- Implementation of CQRS and Repository patterns
- Hypermedia API
- SQL Server for database management
- Adherence to TypeScript and Node.js best practices
- Swagger for API documentation

## Additional Features

- An audit system for monitoring user activities and document changes.
- Management of document and certificate expiration.
- Identity verification for secure user and organization registration.
- Document sharing capabilities.
- Enhanced error handling and analytics features.

## Installation

```bash
yarn install
```

## Running the Application

```bash
# Development mode
$ yarn run start

# Watch mode
$ yarn run start:dev

# Production mode
$ yarn run start:prod
```

## Testing

```bash
# Unit tests
$ yarn run test

# E2E tests
$ yarn run test:e2e

# Test coverage
$ yarn run test:cov
```

## Author

**Ephrem Bayru**

- Location: Addis Abeba, Ethiopia
- Contact: +251 920 208549 | [ephybayru@gmail.com](mailto:ephybayru@gmail.com)
- [LinkedIn Profile](https://www.linkedin.com/in/ephrem-bayru/)
- [GitHub](https://github.com/ephy-bayru/)
- [Twitter](https://twitter.com/ephyInc)
- [Personal Website](https://www.ephrembayru.com/)
- Skype: live:ephybayru

## License

This project is licensed under the MIT License.
