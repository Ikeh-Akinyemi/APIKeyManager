# API Keys Manager

## Overview
API Keys Manager is a web application designed to manage API keys securely. It provides functionalities for creating, updating, and deleting API keys, as well as associating them with specific websites or users.

## Features
- **API Key Management**: Allows users to create, update, and delete API keys.
- **Website and User Management**: Provides functionalities for managing websites and users associated with API keys.
- **Secure Authentication**: Implements secure authentication mechanisms to ensure user access control and protect sensitive data.
- **Flexible Permissions**: Enables customization of permissions and access levels for API keys, websites, and users.

## Technologies Used
- **Backend**: tRPC with Express.js for handling HTTP requests and business logic.
  - **Database**: SQLite for storing API keys, websites, users, and audit logs.
  - **Authentication**: PASETO Tokens (JWT) for user authentication and authorization.
  - **Schema Validation**: Zod for validating input data and ensuring data integrity.
  - **ORM**: Sequelize for interacting with the database and managing data models.
- **Frontend**: coming soon...

## Getting Started
1. Clone the repository: `git clone https://github.com/Ikeh-Akinyemi/api-keys-manager.git`
2. Install dependencies: `cd backend; npm install`
3. Configure environment variables: Set up environment variables for database connection, PASETO secret, etc.
4. Start the server: Run `npm run dev` to start the server.
5. Access the API: Use tools like Postman or curl to interact with the RPC endpoints, [see routes](./server/src/api/router/_app.ts).

## Contributing
Contributions are welcome! Please open an issue or submit a pull request with your suggestions, bug fixes, or new features.
