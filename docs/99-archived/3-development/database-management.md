# Database Management with Prisma

This document outlines the procedures for managing the database schema and keeping it in sync with Prisma.

## Database Configuration

The database connection is configured through environment variables in `.env`:
```env
DATABASE_URL="postgresql://jamespace@localhost:5432/tgeld"
```

## Workflow Scenarios

### 1. When Database Changes First (Database-First Approach)
Use this approach when changes are made directly to the PostgreSQL database (e.g., through SQL migrations).

```bash
# Pull the current database schema into Prisma
npx prisma db pull

# Generate the Prisma client
npx prisma generate
```

### 2. When Prisma Schema Changes First (Schema-First Approach)
Use this approach when you want to make database changes through Prisma.

```bash
# Edit the schema.prisma file first, then:
npx prisma migrate dev --name description_of_changes
```

The `migrate dev` command will:
- Create a new migration file
- Apply the migration to your database
- Regenerate the Prisma Client

## Important Notes

### Check Constraints
Our database includes check constraints that Prisma doesn't fully support:
- `valid_payment_status` on `CompletedTask`
- `valid_transaction_type` on `PiggybankTransaction`

These constraints are enforced at the database level but not by Prisma Client.

### Best Practices
1. **Always commit migration files** to version control
2. **Never modify existing migrations** that have been applied to any environment
3. **Use meaningful names** for migrations (e.g., `add_user_birthday_field`)
4. **Review schema changes** before applying migrations
5. **Test migrations** in development before applying to production

### Common Issues and Solutions

1. **Database Connection Issues**
   ```bash
   # Verify database connection
   psql -d tgeld
   ```

2. **Schema Drift**
   If your Prisma schema doesn't match the database:
   ```bash
   npx prisma db pull
   npx prisma generate
   ```

## Production Considerations

1. **Never use `db push` in production** - always use migrations
2. **Backup the database** before applying migrations
3. **Review migration files** before applying them
4. Use `prisma migrate deploy` in production:
   ```bash
   npx prisma migrate deploy
   ```

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Migration Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Database Check Constraints](https://www.prisma.io/docs/concepts/components/prisma-schema/constraints#check-constraints) 