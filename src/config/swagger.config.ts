import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Blockchain-based Document and Certificate Authorization App')
  .setDescription(
    `This application leverages blockchain technology to offer a secure and efficient platform for document and certificate authorization. It's designed for users and organizations to manage digital certificates and documents with ease, employing the robust capabilities of NestJS for scalable server-side applications.

**Key Features**:
- **Admin Functionalities**: User and organization management, role assignments.
- **User Functionalities**: Secure login, document management via IPFS, digital certification.
- **Organization Functionalities**: Account management, digital certificate issuance, document verification.

**Technology Stack**: Ethereum, Solidity, Truffle Suite, Angular, NestJS, PostgreSQL, IPFS, and more.`,
  )
  .setVersion('1.0')
  .addTag('Admin', 'Endpoints related to admin functionalities')
  .addTag('User', 'Endpoints related to user functionalities')
  .addTag('Organization', 'Endpoints related to organization functionalities')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
  .setContact('Ephrem Bayru', 'https://ephybayru.com', 'ephybayru@gmail.com')
  .setLicense('MIT', 'https://opensource.org/licenses/MIT')
  .addServer(
    process.env.DEV_URL || 'http://localhost:3000',
    'Development Server',
  )
  .addServer(
    process.env.PROD_URL || 'https://api.authorizationapp.com',
    'Production Server',
  )
  .build();

export const swaggerCustomOptions: SwaggerCustomOptions = {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestDuration: true,
  },
  customSiteTitle:
    'Document and Certificate Authorization App API Documentation',
};
