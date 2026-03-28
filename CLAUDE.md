# APIKeyManager Codebase Guidelines

## Authentication and Token Handling
- PASETO token generation and verification must always handle errors explicitly.
  Do not use try/catch blocks that swallow errors silently with empty catch bodies.
- Token expiry must be validated before any protected route handler executes.
  Middleware that skips expiry checks is a critical bug.

## Database and ORM
- All Sequelize operations that modify state (create, update, destroy) must be
  wrapped in a transaction when more than one model is affected.
- Raw SQL queries are not permitted. Use Sequelize model methods exclusively.

## Error Propagation
- tRPC procedures must not catch errors and return undefined or null silently.
  Use TRPCError with an explicit code and message for all failure paths.
- Express middleware must call next(err) on failure, not next() or return void.

## Input Validation
- All tRPC procedure inputs must have a Zod schema. Procedures without input
  validation are not permitted.
- Zod schemas must use .strict() on object types to reject unknown fields.