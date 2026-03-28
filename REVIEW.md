# Code Review Scope

## Always flag
- Authentication middleware that does not validate token expiry
- tRPC procedures missing Zod input validation
- Sequelize multi-model mutations outside a transaction
- Empty catch blocks that discard errors silently
- express middleware that calls next() instead of next(err) on failure

## Flag as nit
- CLAUDE.md naming or style violations in non-auth code
- Missing .strict() on Zod schemas in low-risk read procedures

## Skip
- node_modules/
- *.lock files
- Migration files under db/migrations/ (generated, schema changes reviewed separately)
- Test fixtures and seed data